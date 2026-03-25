import { NextResponse } from 'next/server';
import { authenticateUser, createSessionToken } from '@/lib/server/userStore';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? '').trim();
  const password = String(body?.password ?? '');
  const user = authenticateUser(email, password);
  if (!user) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });

  const token = createSessionToken(user.id);
  return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}
