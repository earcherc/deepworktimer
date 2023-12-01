import { MyJWTPayload, verifyJwtToken } from '@libs/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await fetch('http://localhost:8002/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-api-key': process.env.API_KEY || '',
    },
    body: params,
  });

  if (!res.ok) {
    const body = await res.json();
    return NextResponse.json({ body, status: 500 });
  }

  const body = await res.json();

  const jwtCookie = {
    name: 'jwt',
    value: body.access_token,
    maxAge: 60 * 60,
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
  };

  // Decode the JWT token to get the user data
  const { sub, user_id, disabled } = (await verifyJwtToken(body.access_token)) as MyJWTPayload;

  const tokenData: Partial<TokenData> = {
    username: sub,
    userId: user_id,
    isDisabled: disabled,
  };

  const userCookie = {
    name: 'user',
    value: JSON.stringify(tokenData),
    maxAge: 60 * 60,
    secure: true,
    sameSite: 'strict' as const,
  };

  const response = NextResponse.json({ body: { ...body, user: tokenData }, status: 200 });
  response.cookies.set(jwtCookie);
  response.cookies.set(userCookie);

  return response;
}
