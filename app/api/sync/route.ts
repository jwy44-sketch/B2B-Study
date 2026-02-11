import { NextResponse } from 'next/server';

type SyncPayload = {
  key: string;
  session: unknown;
};

const syncStore = globalThis as typeof globalThis & {
  __b2bSyncStore?: Map<string, { session: unknown; updatedAt: string }>;
};

const getStore = () => {
  if (!syncStore.__b2bSyncStore) {
    syncStore.__b2bSyncStore = new Map();
  }
  return syncStore.__b2bSyncStore;
};

export async function POST(request: Request) {
  const body = await request.json() as SyncPayload;
  if (!body.key || !body.session) {
    return NextResponse.json({ ok: false, message: 'Missing key or session' }, { status: 400 });
  }

  getStore().set(body.key, { session: body.session, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) {
    return NextResponse.json({ ok: false, message: 'Missing key' }, { status: 400 });
  }

  const hit = getStore().get(key);
  if (!hit) {
    return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, session: hit.session, updatedAt: hit.updatedAt });
}
