import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@libs/utils';

const PUBLIC_ROUTES = ['/login', '/register', '/', '/logout'];
const isPublicPage = (url: string) => PUBLIC_ROUTES.some((page) => page.startsWith(url));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('jwt');

  const isPublicPageRequested = isPublicPage(pathname);
  const hasVerifiedToken = await verifyJwtToken(authCookie?.value);

  // If unprotected route just continue
  if (isPublicPageRequested) {
    return NextResponse.next();
  }

  // If the path is protected, we check the auth token
  if (!hasVerifiedToken) {
    request.nextUrl.pathname = '/login';
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
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
  ],
};
