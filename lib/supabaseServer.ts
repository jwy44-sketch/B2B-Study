const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function requireServerConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server configuration.');
  }
}

async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  requireServerConfig();
  const headers: Record<string, string> = {
    apikey: SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY!}`,
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined)
  };
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
}

export async function findProfileByNormalizedUsername(usernameNormalized: string): Promise<{ user_id: string; auth_email_alias: string } | null> {
  const res = await adminFetch(`/rest/v1/profiles?select=user_id,auth_email_alias&username_normalized=eq.${encodeURIComponent(usernameNormalized)}&limit=1`);
  if (!res.ok) return null;
  const rows = (await res.json()) as { user_id: string; auth_email_alias: string }[];
  return rows[0] ?? null;
}

export async function createAuthUserWithAlias(authEmailAlias: string, password: string): Promise<{ user_id: string }> {
  const res = await adminFetch('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email: authEmailAlias,
      password,
      email_confirm: true
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg ?? 'Account creation failed');
  return { user_id: data.user.id as string };
}

export async function upsertProfile(userId: string, username: string, usernameNormalized: string, authEmailAlias: string): Promise<void> {
  const res = await adminFetch('/rest/v1/profiles?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([
      {
        user_id: userId,
        username,
        username_normalized: usernameNormalized,
        auth_email_alias: authEmailAlias,
        updated_at: new Date().toISOString()
      }
    ])
  });
  if (!res.ok) {
    const data = await res.text();
    throw new Error(`Profile update failed: ${data}`);
  }
}

export async function passwordGrantWithAlias(authEmailAlias: string, password: string): Promise<any> {
  requireServerConfig();
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: authEmailAlias, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg ?? data?.error_description ?? 'Invalid username or password');
  return data;
}
