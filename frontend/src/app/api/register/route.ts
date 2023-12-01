import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  const body: Partial<User> = {
    username,
    email,
    password,
  };

  const res = await fetch('http://localhost:8002/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY || '',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const body = await res.json();
    return NextResponse.json({ body, status: 500 });
  }

  return NextResponse.json({ status: 200 });
}
