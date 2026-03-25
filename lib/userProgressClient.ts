import { getAuthToken } from './authClient';

export const loadUserProgress = async (modeKey: string) => {
  const token = getAuthToken();
  if (!token) return null;
  const res = await fetch(`/api/user-progress?modeKey=${encodeURIComponent(modeKey)}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.progress ?? null;
};

export const saveUserProgress = async (modeKey: string, datasetKey: string, state: unknown) => {
  const token = getAuthToken();
  if (!token) return;
  await fetch('/api/user-progress', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ modeKey, datasetKey, state })
  });
};
