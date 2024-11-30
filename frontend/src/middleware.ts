import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

const authUrl = ['/login', '/signup', '/welcome', '/market'];
const disableRoutes = ['/settings', '/ad-gen', '/background-change-faceswap', '/outfit-tryon'];

export function middleware(req: NextRequest) {

  const token = req.cookies.get('hom_token');
  const { pathname } = req.nextUrl;

  const isExcludeRoute = authUrl.includes(pathname);

  if (disableRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/404', req.url));
  }

  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  if (token && (pathname === '/login' || pathname === '/signup')) {
    const response = NextResponse.redirect(new URL('/welcome', req.url));
    return response;
  }

  if (pathname === '/') {
    const response = NextResponse.redirect(new URL('/login', req.url));
    return response;
  }

  if (!token && !isExcludeRoute) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/login',
    '/signup',
  ],
};
