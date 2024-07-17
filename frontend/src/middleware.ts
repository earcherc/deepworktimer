import { NextRequest, NextResponse } from 'next/server';

const getSessionValidationEndpoint = () => {
  return `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-session`;
};

async function validateSessionToken(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_id');

  if (!sessionCookie) {
    return false;
  }

  try {
    const endpoint = getSessionValidationEndpoint();
    console.log('Validating session at:', endpoint);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
