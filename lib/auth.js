const { SignJWT, jwtVerify } = require('jose');

const SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-session-secret-change-me');
const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || 'dev-admin-secret-change-me');

async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SESSION_SECRET);
}

async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload;
  } catch {
    return null;
  }
}

async function signAdminSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(ADMIN_SECRET);
}

async function verifyAdminSession(token) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET);
    return payload;
  } catch {
    return null;
  }
}

async function signStaffSession(payload) {
  return new SignJWT({ ...payload, role: 'staff' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SESSION_SECRET);
}

async function verifyStaffSession(token) {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload.role === 'staff' ? payload : null;
  } catch {
    return null;
  }
}

async function signAffiliateSession(payload) {
  return new SignJWT({ ...payload, role: 'affiliate' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SESSION_SECRET);
}

async function verifyAffiliateSession(token) {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload.role === 'affiliate' ? payload : null;
  } catch {
    return null;
  }
}

module.exports = {
  signSession,
  verifySession,
  signAdminSession,
  verifyAdminSession,
  signStaffSession,
  verifyStaffSession,
  signAffiliateSession,
  verifyAffiliateSession,
};
