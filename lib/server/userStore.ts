import { createHash, randomUUID } from 'node:crypto';

type User = { id: string; email: string; passwordHash: string; createdAt: number };

type ProgressRow = { modeKey: string; datasetKey: string; state: unknown; updatedAt: number };

const usersByEmail = new Map<string, User>();
const sessionsByToken = new Map<string, string>();
const progressByUser = new Map<string, Map<string, ProgressRow>>();

const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export const createUser = (email: string, password: string): User | null => {
  const normalized = email.trim().toLowerCase();
  if (!normalized || usersByEmail.has(normalized)) return null;
  const user: User = { id: randomUUID(), email: normalized, passwordHash: hash(password), createdAt: Date.now() };
  usersByEmail.set(normalized, user);
  return user;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = usersByEmail.get(email.trim().toLowerCase());
  if (!user) return null;
  if (user.passwordHash !== hash(password)) return null;
  return user;
};

export const createSessionToken = (userId: string): string => {
  const token = randomUUID();
  sessionsByToken.set(token, userId);
  return token;
};

export const getUserByToken = (token: string | null | undefined): User | null => {
  if (!token) return null;
  const userId = sessionsByToken.get(token);
  if (!userId) return null;
  return [...usersByEmail.values()].find((u) => u.id === userId) ?? null;
};

export const revokeSessionToken = (token: string | null | undefined): void => {
  if (!token) return;
  sessionsByToken.delete(token);
};

export const saveProgress = (userId: string, modeKey: string, datasetKey: string, state: unknown): ProgressRow => {
  const byMode = progressByUser.get(userId) ?? new Map<string, ProgressRow>();
  const row: ProgressRow = { modeKey, datasetKey, state, updatedAt: Date.now() };
  byMode.set(modeKey, row);
  progressByUser.set(userId, byMode);
  return row;
};

export const loadProgress = (userId: string, modeKey: string): ProgressRow | null => {
  return progressByUser.get(userId)?.get(modeKey) ?? null;
};
