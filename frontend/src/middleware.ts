import { NextRequest, NextResponse } from 'next/server';

const getSessionValidationEndpoint = () => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-session`;
  console.log('Session validation endpoint:', endpoint);
  return endpoint;
};

async function validateSessionToken(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_id');
  console.log('Session cookie:', sessionCookie ? 'exists' : 'not found');
  
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
        'Cookie': `session_id=${sessionCookie.value}`,
      },
      credentials: 'include',
    });
    
    console.log('Session validation response status:', response.status);
    
    if (!response.ok) {
      console.error('Session validation failed:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('Session validation response:', data);
    
    return data.isValid;
  } catch (error) {
    console.error('Error validating session token:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  console.log('Middleware called for URL:', request.url);
  
  const isValidSession = await validateSessionToken(request);
  console.log('Is session valid:', isValidSession);

  if (!isValidSession) {
    console.log('Redirecting to login page');
    const url = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  console.log('Allowing access to protected route');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};