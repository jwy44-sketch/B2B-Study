import { NextResponse } from 'next/server';
import { getUserByToken, loadProgress, saveProgress } from '@/lib/server/userStore';

const authUser = (req: Request) => {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  return getUserByToken(token);
};

export async function GET(req: Request) {
  const user = authUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const modeKey = url.searchParams.get('modeKey') ?? '';
  if (!modeKey) return NextResponse.json({ error: 'modeKey is required' }, { status: 400 });

  const row = loadProgress(user.id, modeKey);
  return NextResponse.json({ progress: row });
}

export async function POST(req: Request) {
  const user = authUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const modeKey = String(body?.modeKey ?? '');
  const datasetKey = String(body?.datasetKey ?? '');
  const state = body?.state;

  if (!modeKey) return NextResponse.json({ error: 'modeKey is required' }, { status: 400 });
  const row = saveProgress(user.id, modeKey, datasetKey, state);
  return NextResponse.json({ progress: row });
}
