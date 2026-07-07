import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin dashboard
  if (path.startsWith('/admin/dashboard')) {
    const session = request.cookies.get('lf_admin_session')?.value;
    if (session !== 'authenticated') {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged in admin from seeing login page
  if (path === '/admin') {
    const session = request.cookies.get('lf_admin_session')?.value;
    if (session === 'authenticated') {
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
