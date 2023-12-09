import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/', '/logout'];
const isPublicPage = (url: string) => PUBLIC_ROUTES.some((page) => url.startsWith(page));
const sessionValidationEndpoint = 'https://localhost/8000/auth/validate-session';

async function validateSessionToken(sessionId: RequestCookie | undefined) {
  try {
    const response = await fetch(sessionValidationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Error validating session token:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session_id');

  const isPublicPageRequested = isPublicPage(pathname);
  const isValidSession = sessionToken ? await validateSessionToken(sessionToken) : false;

  if (isPublicPageRequested || isValidSession) {
    return NextResponse.next();
  }

  const url = new URL('/login', request.nextUrl.origin);
  return NextResponse.redirect(url);
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
