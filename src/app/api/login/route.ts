// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { User } from '@/src/types/auth.type';
import { Role } from '@/src/types/role.type';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_NAME = 'token';
const MAX_AGE = 60 * 60 * 24; // 1 day

const createJWT = async (user: User) => {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(new TextEncoder().encode(JWT_SECRET));
};

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !['password123', 'admin123'].includes(password)) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const role: Role =
    username === 'superadmin'
      ? 'superadmin'
      : username === 'admin'
      ? 'admin'
      : 'user';

  const user: User = {
    id: '1',
    username,
    email: `${username}@example.com`,
    role,
    verified: true,
    created_at: new Date().toISOString(),
  };

  const token = await createJWT(user);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
    sameSite: 'lax',
  });
  
  return NextResponse.json({ user });
}
