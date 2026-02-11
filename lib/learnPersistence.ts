import { initializeLearnEngine, type LearnEngineState } from './learnEngine';

const LEARN_STORAGE_KEY = 'b2bStudy.learn.v1';
const PERSISTENCE_VERSION = 1;

export type PersistedLearnSession = {
  version: number;
  datasetVersion: string;
  savedAt: string;
  engine: LearnEngineState;
};

const isBrowser = () => typeof window !== 'undefined';

const safeParseJSON = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const isValidEngineShape = (engine: LearnEngineState | null | undefined): engine is LearnEngineState => {
  if (!engine) return false;
  return Array.isArray(engine.allIds)
    && typeof engine.batchSize === 'number'
    && typeof engine.masteryTarget === 'number'
    && typeof engine.batchStartIndex === 'number'
    && Array.isArray(engine.batchIds)
    && Array.isArray(engine.queue)
    && typeof engine.statsById === 'object'
    && 'currentQuestionId' in engine
    && typeof engine.sessionComplete === 'boolean'
    && typeof engine.reviewingMissed === 'boolean';
};

const normalizeQueue = (engine: LearnEngineState): LearnEngineState => {
  if (engine.sessionComplete) return engine;

  const unmastered = engine.batchIds.filter((id) => !engine.statsById[id]?.mastered);
  const queueFromSaved = engine.queue.filter((id) => unmastered.includes(id));
  const queue = queueFromSaved.length ? queueFromSaved : [...unmastered];
  const currentQuestionId = queue.includes(engine.currentQuestionId ?? '') ? engine.currentQuestionId : (queue[0] ?? null);

  return {
    ...engine,
    queue,
    currentQuestionId
  };
};

export const loadLearnSession = (): PersistedLearnSession | null => {
  if (!isBrowser()) return null;
  return safeParseJSON<PersistedLearnSession>(window.localStorage.getItem(LEARN_STORAGE_KEY));
};

export const importLearnSession = (session: PersistedLearnSession): boolean => {
  if (!isBrowser()) return false;
  if (session.version !== PERSISTENCE_VERSION || !isValidEngineShape(session.engine)) return false;
  window.localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(session));
  return true;
};

export const saveLearnSession = (input: { datasetVersion: string; engine: LearnEngineState }): void => {
  if (!isBrowser()) return;

  const payload: PersistedLearnSession = {
    version: PERSISTENCE_VERSION,
    datasetVersion: input.datasetVersion,
    savedAt: new Date().toISOString(),
    engine: input.engine
  };

  window.localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(payload));
};

export const clearLearnSession = (): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LEARN_STORAGE_KEY);
};

export const restoreOrInitializeLearnEngine = (params: {
  allIds: string[];
  batchSize: number;
  masteryTarget: number;
  datasetVersion: string;
}): { engine: LearnEngineState; resetReason?: 'version_mismatch' | 'corrupt' } => {
  const fresh = initializeLearnEngine(params.allIds, params.batchSize, params.masteryTarget);
  const saved = loadLearnSession();

  if (!saved || saved.version !== PERSISTENCE_VERSION) return { engine: fresh };
  if (saved.datasetVersion !== params.datasetVersion) {
    clearLearnSession();
    return { engine: fresh, resetReason: 'version_mismatch' };
  }
  if (!isValidEngineShape(saved.engine)) {
    clearLearnSession();
    return { engine: fresh, resetReason: 'corrupt' };
  }

  const restored: LearnEngineState = {
    ...saved.engine,
    allIds: params.allIds,
    batchSize: params.batchSize,
    masteryTarget: params.masteryTarget
  };

  const knownIdSet = new Set(params.allIds);
  if (restored.currentQuestionId && !knownIdSet.has(restored.currentQuestionId)) {
    clearLearnSession();
    return { engine: fresh, resetReason: 'version_mismatch' };
  }

  return { engine: normalizeQueue(restored) };
};
