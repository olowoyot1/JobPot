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

module.exports = {
  signSession,
  verifySession,
  signAdminSession,
  verifyAdminSession,
};
