const { cookies } = require('next/headers');
const { verifyAdminSession } = require('./auth');

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  const payload = await verifyAdminSession(token);
  return Boolean(payload);
}

module.exports = { requireAdmin };
