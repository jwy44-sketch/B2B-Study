import { NextResponse } from 'next/server';
import { createSessionToken, createUser } from '@/lib/server/userStore';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? '').trim();
  const password = String(body?.password ?? '');

  if (!email || password.length < 8) {
    return NextResponse.json({ error: 'Use a valid email and password (8+ characters).' }, { status: 400 });
  }

  const user = createUser(email, password);
  if (!user) return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });

  const token = createSessionToken(user.id);
  return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}
