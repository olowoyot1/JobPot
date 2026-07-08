'use server';

import { cookies, headers } from 'next/headers';
import crypto from 'crypto';
import { prisma } from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/password';
import { signSession, signAdminSession } from '../lib/auth';
import { sendEmail } from '../lib/email';
import { getSettings } from '../lib/settings';

export async function signupAction(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = String(formData.get('phone') || '').trim();
  const preferred = String(formData.get('preferred') || '').trim();
  const password = String(formData.get('password') || '');
  const refCode = String(formData.get('ref') || '').trim();

  if (!name || !email || !password) {
    return { error: 'Please fill in your name, email and a password.' };
  }
  if (password.length < 6) {
    return { error: 'Password should be at least 6 characters.' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'An account with this email already exists. Try logging in.' };
  }

  let referredById = null;
  if (refCode) {
    const affiliate = await prisma.affiliate.findUnique({ where: { code: refCode } });
    if (affiliate) referredById = affiliate.id;
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone, preferred, password: hashed, referredById },
  });

  const token = await signSession({ userId: user.id });
  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true };
}

export async function loginAction(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'No matching account found. Check your details or create an account.' };
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { error: 'No matching account found. Check your details or create an account.' };
  }

  const token = await signSession({ userId: user.id });
  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true };
}

export async function logoutAction() {
  (await cookies()).delete('session');
  return { success: true };
}

export async function adminLoginAction(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || '';

  if (!adminEmail || !adminPassword) {
    return { error: 'Admin credentials are not configured on the server yet.' };
  }
  if (email !== adminEmail || password !== adminPassword) {
    return { error: 'Incorrect admin email or password.' };
  }

  const token = await signAdminSession({ role: 'admin', email });
  (await cookies()).set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return { success: true };
}

export async function adminLogoutAction() {
  (await cookies()).delete('admin_session');
  return { success: true };
}

async function getSiteOrigin() {
  const h = await headers();
  const host = h.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function requestPasswordReset(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email) {
    return { error: 'Please enter your email address.' };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success, whether or not the account exists — avoids leaking
  // which emails are registered.
  if (!user) {
    return { success: true };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const origin = await getSiteOrigin();
  const settings = await getSettings();
  const resetLink = `${origin}/reset-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: `Reset your password — ${settings.siteName}`,
    html: `
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. Click the link below to choose a new one — this link expires in 1 hour:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });

  return { success: true };
}

export async function resetPassword(formData) {
  const token = String(formData.get('token') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!token) {
    return { error: 'Missing or invalid reset link.' };
  }
  if (password.length < 6) {
    return { error: 'Password should be at least 6 characters.' };
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: 'This reset link is invalid or has expired. Please request a new one.' };
  }

  const hashed = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  return { success: true };
}
