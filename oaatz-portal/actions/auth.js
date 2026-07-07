'use server';

const { cookies } = require('next/headers');
const { prisma } = require('../lib/db');
const { hashPassword, verifyPassword } = require('../lib/password');
const {
  signSession,
  signAdminSession,
} = require('../lib/auth');

async function signupAction(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = String(formData.get('phone') || '').trim();
  const preferred = String(formData.get('preferred') || '').trim();
  const password = String(formData.get('password') || '');

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

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone, preferred, password: hashed },
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

async function loginAction(formData) {
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

async function logoutAction() {
  (await cookies()).delete('session');
  return { success: true };
}

async function adminLoginAction(formData) {
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

async function adminLogoutAction() {
  (await cookies()).delete('admin_session');
  return { success: true };
}

module.exports = {
  signupAction,
  loginAction,
  logoutAction,
  adminLoginAction,
  adminLogoutAction,
};
