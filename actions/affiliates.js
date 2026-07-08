'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/password';
import { signAffiliateSession } from '../lib/auth';
import { requireAdmin } from '../lib/require-admin';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 10) || 'partner';
}

async function generateUniqueCode(name) {
  const base = slugify(name);
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}${Math.floor(100 + Math.random() * 900)}`;
    const existing = await prisma.affiliate.findUnique({ where: { code: candidate } });
    if (!existing) return candidate;
  }
  return `${base}${Date.now()}`;
}

export async function affiliateSignupAction(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name || !email || !password) {
    return { error: 'Please fill in your name, email and a password.' };
  }
  if (password.length < 6) {
    return { error: 'Password should be at least 6 characters.' };
  }

  const existing = await prisma.affiliate.findUnique({ where: { email } });
  if (existing) {
    return { error: 'An affiliate account with this email already exists. Try logging in.' };
  }

  const code = await generateUniqueCode(name);
  const hashed = await hashPassword(password);
  const affiliate = await prisma.affiliate.create({
    data: { name, email, password: hashed, code },
  });

  const token = await signAffiliateSession({ affiliateId: affiliate.id });
  (await cookies()).set('affiliate_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true };
}

export async function affiliateLoginAction(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const affiliate = await prisma.affiliate.findUnique({ where: { email } });
  if (!affiliate) {
    return { error: 'No matching affiliate account found.' };
  }
  const valid = await verifyPassword(password, affiliate.password);
  if (!valid) {
    return { error: 'No matching affiliate account found.' };
  }

  const token = await signAffiliateSession({ affiliateId: affiliate.id });
  (await cookies()).set('affiliate_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true };
}

export async function affiliateLogoutAction() {
  (await cookies()).delete('affiliate_session');
  return { success: true };
}

export async function markCommissionPaid(commissionId) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.commission.update({ where: { id: commissionId }, data: { status: 'paid' } });
  revalidatePath('/admin/affiliates');
}
