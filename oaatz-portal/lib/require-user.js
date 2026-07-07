const { cookies } = require('next/headers');
const { verifySession } = require('./auth');
const { prisma } = require('./db');

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload?.userId) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
}

module.exports = { getCurrentUser };
