'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/password';
import { signStaffSession } from '../lib/auth';
import { requireAdmin } from '../lib/require-admin';

export async function createStaff(formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name || !email || password.length < 6) return;

  const existing = await prisma.staff.findUnique({ where: { email } });
  if (existing) return;

  const hashed = await hashPassword(password);
  await prisma.staff.create({ data: { name, email, password: hashed } });

  revalidatePath('/admin/staff');
}

export async function deleteStaff(id) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.staff.delete({ where: { id } });
  revalidatePath('/admin/staff');
}

export async function staffLoginAction(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const staff = await prisma.staff.findUnique({ where: { email } });
  if (!staff) {
    return { error: 'No matching staff account found.' };
  }
  const valid = await verifyPassword(password, staff.password);
  if (!valid) {
    return { error: 'No matching staff account found.' };
  }

  const token = await signStaffSession({ staffId: staff.id });
  (await cookies()).set('staff_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true };
}

export async function staffLogoutAction() {
  (await cookies()).delete('staff_session');
  return { success: true };
}
