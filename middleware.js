const { NextResponse } = require('next/server');
const {
  verifySession,
  verifyAdminSession,
  verifyStaffSession,
  verifyAffiliateSession,
} = require('./lib/auth');

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

  if (pathname.startsWith('/staff') && pathname !== '/staff/login') {
    const token = request.cookies.get('staff_session')?.value;
    const payload = token ? await verifyStaffSession(token) : null;
    if (!payload) {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }
  }

  if (
    pathname.startsWith('/affiliate') &&
    pathname !== '/affiliate/login' &&
    pathname !== '/affiliate/signup'
  ) {
    const token = request.cookies.get('affiliate_session')?.value;
    const payload = token ? await verifyAffiliateSession(token) : null;
    if (!payload) {
      return NextResponse.redirect(new URL('/affiliate/login', request.url));
    }
  }

  return NextResponse.next();
}

module.exports = { middleware };
module.exports.config = {
  matcher: ['/admin/:path*', '/account/:path*', '/staff/:path*', '/affiliate/:path*'],
};
