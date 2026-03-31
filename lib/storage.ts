import { getCurrentUserId, upsertUserState } from './supabase';

export const storageKeys = {
  progress: 'b2b_progress_v1',
  bookmarks: 'b2b_bookmarks_v1',
  attempts: 'b2b_attempts_v1',
  flagged: 'b2b_flagged_v1',
  settings: 'b2b_settings_v1'
} as const;

export function buildScopedKey(key: string, userId: string | null): string {
  return userId ? `${key}::${userId}` : `${key}::guest`;
}

function resolveScopedKey(key: string): string {
  return buildScopedKey(key, getCurrentUserId());
}

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const scoped = resolveScopedKey(key);
  const raw = localStorage.getItem(scoped);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}


export function removeJson(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(resolveScopedKey(key));
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  const scoped = resolveScopedKey(key);
  localStorage.setItem(scoped, JSON.stringify(value));
  void upsertUserState(key, value).catch(() => undefined);
}
