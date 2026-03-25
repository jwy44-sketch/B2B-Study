import { NextResponse } from 'next/server';
import { getUserByToken } from '@/lib/server/userStore';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = getUserByToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
