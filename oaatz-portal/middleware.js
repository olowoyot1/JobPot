const { NextResponse } = require('next/server');
const { verifySession, verifyAdminSession } = require('./lib/auth');

async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_session')?.value;
    const payload = token ? await verifyAdminSession(token) : null;
    if (!payload) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname.startsWith('/account')) {
    const token = request.cookies.get('session')?.value;
    const payload = token ? await verifySession(token) : null;
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

module.exports = { middleware };
module.exports.config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
