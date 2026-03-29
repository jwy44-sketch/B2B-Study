const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const AUTH_SESSION_KEY = 'b2b_auth_session_v1';

type StoredSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string | null;
  email: string | null;
};

type UserStateRow = {
  state_key: string;
  state_value: unknown;
};

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export function hasSupabaseConfig(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function getStoredSession(): StoredSession | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  const raw = storage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function setStoredSession(session: StoredSession | null): void {
  const storage = getSessionStorage();
  if (!storage) return;
  if (!session) {
    storage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function requireConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
}

async function authFetch(path: string, init: RequestInit = {}, token?: string): Promise<Response> {
  requireConfig();
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY!,
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined)
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
}

function buildSessionFromAuthResponse(data: any): StoredSession {
  const accessToken = data.access_token as string;
  const refreshToken = data.refresh_token as string;
  const expiresIn = Number(data.expires_in ?? 3600);
  const payload = parseJwtPayload(accessToken);
  const userId = typeof payload?.sub === 'string' ? payload.sub : null;
  const email = typeof payload?.email === 'string' ? payload.email : null;
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    userId,
    email
  };
}

export function getCurrentUserId(): string | null {
  return getStoredSession()?.userId ?? null;
}

export async function signUpWithPassword(email: string, password: string): Promise<void> {
  const res = await authFetch('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg ?? data?.error_description ?? 'Sign up failed');
  if (data?.access_token) {
    setStoredSession(buildSessionFromAuthResponse(data));
  }
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const res = await authFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg ?? data?.error_description ?? 'Log in failed');
  setStoredSession(buildSessionFromAuthResponse(data));
}

export async function resetPasswordForEmail(email: string): Promise<void> {
  const res = await authFetch('/auth/v1/recover', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg ?? data?.error_description ?? 'Password reset request failed');
}

async function refreshIfNeeded(session: StoredSession): Promise<StoredSession | null> {
  if (session.expiresAt > Date.now() + 30_000) return session;
  const res = await authFetch('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: session.refreshToken })
  });
  const data = await res.json();
  if (!res.ok) {
    setStoredSession(null);
    return null;
  }
  const next = buildSessionFromAuthResponse(data);
  setStoredSession(next);
  return next;
}

export async function getValidSession(): Promise<StoredSession | null> {
  const session = getStoredSession();
  if (!session) return null;
  return refreshIfNeeded(session);
}

export async function signOut(): Promise<void> {
  const session = await getValidSession();
  if (session) {
    await authFetch('/auth/v1/logout', { method: 'POST' }, session.accessToken).catch(() => undefined);
  }
  setStoredSession(null);
}

export async function getCurrentUser(): Promise<{ id: string; email: string | null } | null> {
  const session = await getValidSession();
  if (!session) return null;
  const res = await authFetch('/auth/v1/user', { method: 'GET' }, session.accessToken);
  const data = await res.json();
  if (!res.ok) return null;
  return { id: data.id as string, email: (data.email as string | undefined) ?? null };
}

export async function upsertUserState(stateKey: string, stateValue: unknown): Promise<void> {
  const session = await getValidSession();
  if (!session?.userId) return;
  const body = [
    {
      user_id: session.userId,
      state_key: stateKey,
      state_value: stateValue
    }
  ];
  const res = await authFetch('/rest/v1/user_state?on_conflict=user_id,state_key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(body)
  }, session.accessToken);
  if (!res.ok) {
    const data = await res.text();
    throw new Error(`Cloud save failed: ${data}`);
  }
}

export async function fetchUserState(): Promise<UserStateRow[]> {
  const session = await getValidSession();
  if (!session?.userId) return [];
  const res = await authFetch(`/rest/v1/user_state?select=state_key,state_value&user_id=eq.${session.userId}`, { method: 'GET' }, session.accessToken);
  if (!res.ok) return [];
  return (await res.json()) as UserStateRow[];
}

export async function syncUserStateFromCloudToLocal(buildScopedKey: (key: string, userId: string | null) => string): Promise<void> {
  const user = await getCurrentUser();
  if (!user || typeof window === 'undefined') return;
  const rows = await fetchUserState();
  rows.forEach((row) => {
    const scoped = buildScopedKey(row.state_key, user.id);
    window.localStorage.setItem(scoped, JSON.stringify(row.state_value));
  });
}
