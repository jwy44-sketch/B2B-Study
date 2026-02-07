export const storageKeys = {
  progress: 'b2b_progress_v1',
  bookmarks: 'b2b_bookmarks_v1',
  attempts: 'b2b_attempts_v1',
  flagged: 'b2b_flagged_v1',
  settings: 'b2b_settings_v1'
} as const;

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}
