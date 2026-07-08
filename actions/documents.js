'use server';

import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { getCurrentUser } from '../lib/require-user';
import { getCurrentStaff } from '../lib/require-staff';
import { requireAdmin } from '../lib/require-admin';

async function requireStaffOrAdmin() {
  if (await requireAdmin()) return true;
  const staff = await getCurrentStaff();
  return Boolean(staff);
}

export async function uploadDocument(formData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please log in to upload documents.' };

  const file = formData.get('file');
  const type = String(formData.get('type') || 'other');

  if (!file || typeof file === 'string' || file.size === 0) {
    return { error: 'Please choose a file to upload.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: 'File is too large. Please keep it under 10MB.' };
  }

  let blob;
  try {
    blob = await put(`documents/${user.id}/${Date.now()}-${file.name}`, file, {
      access: 'private',
    });
  } catch (err) {
    const msg = err?.message || 'unknown error';
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: 'Upload failed. File storage is not configured yet — see BLOB_READ_WRITE_TOKEN in the README.' };
    }
    return { error: `Upload failed: ${msg}` };
  }

  await prisma.document.create({
    data: {
      userId: user.id,
      type,
      fileName: file.name,
      fileUrl: blob.pathname, // stores the blob's pathname, not a public URL — this store is private
    },
  });

  revalidatePath('/account');
  return { success: true };
}

export async function deleteDocument(id) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authorized' };

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc || doc.userId !== user.id) return { error: 'Not found' };

  try {
    await del(doc.fileUrl, { access: 'private' });
  } catch {
    // ignore storage cleanup failures
  }
  await prisma.document.delete({ where: { id } });
  revalidatePath('/account');
  return { success: true };
}

export async function updateDocumentStatus(id, status) {
  if (!(await requireStaffOrAdmin())) throw new Error('Not authorized');
  await prisma.document.update({ where: { id }, data: { status } });
  revalidatePath('/staff');
  revalidatePath('/admin');
}
