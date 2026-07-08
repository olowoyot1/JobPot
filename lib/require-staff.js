const { cookies } = require('next/headers');
const { verifyStaffSession } = require('./auth');
const { prisma } = require('./db');

async function getCurrentStaff() {
  const cookieStore = await cookies();
  const token = cookieStore.get('staff_session')?.value;
  if (!token) return null;
  const payload = await verifyStaffSession(token);
  if (!payload?.staffId) return null;
  return prisma.staff.findUnique({ where: { id: payload.staffId } });
}

module.exports = { getCurrentStaff };
