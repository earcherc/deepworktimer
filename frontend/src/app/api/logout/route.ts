import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ body: { message: 'Logged out' }, status: 200 });

  response.cookies.set({
    name: 'jwt',
    value: '',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: true,
    path: '/',
  });

  response.cookies.set({
    name: 'user',
    value: '',
    maxAge: 0,
    secure: true,
    sameSite: 'strict' as const,
    path: '/',
  });

  return response;
}
