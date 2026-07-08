const { cookies } = require('next/headers');
const { verifyAffiliateSession } = require('./auth');
const { prisma } = require('./db');

async function getCurrentAffiliate() {
  const cookieStore = await cookies();
  const token = cookieStore.get('affiliate_session')?.value;
  if (!token) return null;
  const payload = await verifyAffiliateSession(token);
  if (!payload?.affiliateId) return null;
  return prisma.affiliate.findUnique({ where: { id: payload.affiliateId } });
}

module.exports = { getCurrentAffiliate };
