export type AuthUser = { id: string; email: string };

const TOKEN_KEY = 'b2b_auth_token_v1';

export const getAuthToken = () => (typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY));
export const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
};

const post = async (path: string, body: unknown, token?: string | null) => {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(String(json?.error ?? 'Request failed'));
  return json;
};

export const signUp = async (email: string, password: string): Promise<AuthUser> => {
  const json = await post('/api/auth/signup', { email, password });
  setAuthToken(json.token);
  return json.user as AuthUser;
};

export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  const json = await post('/api/auth/login', { email, password });
  setAuthToken(json.token);
  return json.user as AuthUser;
};

export const signOut = async (): Promise<void> => {
  const token = getAuthToken();
  await post('/api/auth/logout', {}, token).catch(() => null);
  setAuthToken(null);
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const token = getAuthToken();
  if (!token) return null;
  const res = await fetch('/api/auth/me', { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) {
    setAuthToken(null);
    return null;
  }
  const json = await res.json();
  return (json?.user as AuthUser) ?? null;
};
