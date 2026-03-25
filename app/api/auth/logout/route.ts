import { NextResponse } from 'next/server';
import { revokeSessionToken } from '@/lib/server/userStore';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  revokeSessionToken(token);
  return NextResponse.json({ ok: true });
}
