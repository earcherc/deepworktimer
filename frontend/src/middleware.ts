import { NextRequest, NextResponse } from 'next/server';

const sessionValidationEndpoint = 'http://host.docker.internal:8000/auth/validate-session';

async function validateSessionToken(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_id');

  if (!sessionCookie) {
    return false;
  }

  try {
    const response = await fetch(sessionValidationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionCookie.value}`,
      },
    });
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Error validating session token:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isValidSession = await validateSessionToken(request);
  if (!isValidSession) {
    const url = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
