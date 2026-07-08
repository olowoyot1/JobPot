'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { requireAdmin } from '../lib/require-admin';

function readBlockFields(formData) {
  return {
    type: String(formData.get('type') || 'richtext'),
    title: String(formData.get('title') || '').trim() || null,
    subtitle: String(formData.get('subtitle') || '').trim() || null,
    body: String(formData.get('body') || '').trim() || null,
    ctaLabel: String(formData.get('ctaLabel') || '').trim() || null,
    ctaHref: String(formData.get('ctaHref') || '').trim() || null,
    secondaryCtaLabel: String(formData.get('secondaryCtaLabel') || '').trim() || null,
    secondaryCtaHref: String(formData.get('secondaryCtaHref') || '').trim() || null,
    imageUrl: String(formData.get('imageUrl') || '').trim() || null,
    imagePosition: String(formData.get('imagePosition') || 'right'),
  };
}

export async function createPageBlock(formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const last = await prisma.pageBlock.findFirst({ orderBy: { order: 'desc' } });
  const nextOrder = last ? last.order + 1 : 0;

  await prisma.pageBlock.create({
    data: { ...readBlockFields(formData), order: nextOrder },
  });

  revalidatePath('/');
  revalidatePath('/admin/content');
}

export async function updatePageBlock(id, formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.pageBlock.update({ where: { id }, data: readBlockFields(formData) });
  revalidatePath('/');
  revalidatePath('/admin/content');
  revalidatePath(`/admin/content/${id}`);
}

export async function deletePageBlock(id) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.pageBlock.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/content');
}

export async function toggleBlockVisible(id, visible) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.pageBlock.update({ where: { id }, data: { visible } });
  revalidatePath('/');
  revalidatePath('/admin/content');
}

export async function moveBlock(id, direction) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const blocks = await prisma.pageBlock.findMany({ orderBy: { order: 'asc' } });
  const index = blocks.findIndex((b) => b.id === id);
  if (index === -1) return;

  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= blocks.length) return;

  const a = blocks[index];
  const b = blocks[swapWith];

  await prisma.$transaction([
    prisma.pageBlock.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.pageBlock.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath('/');
  revalidatePath('/admin/content');
}

export async function uploadBlockImage(formData) {
  if (!(await requireAdmin())) return { error: 'Not authorized' };

  const file = formData.get('file');
  if (!file || typeof file === 'string' || file.size === 0) {
    return { error: 'Please choose an image to upload.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: 'Image is too large. Please keep it under 10MB.' };
  }

  try {
    const blob = await put(`content/${Date.now()}-${file.name}`, file, { access: 'public' });
    return { success: true, url: blob.url };
  } catch {
    return { error: 'Upload failed. Blob storage may not be configured yet.' };
  }
}
