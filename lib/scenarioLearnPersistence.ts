import { initializeLearnEngine, type LearnEngineState } from './learnEngine';

const STORAGE_KEY = 'b2bStudy.scenarioLearn.v1';
const VERSION = 1;

export type PersistedScenarioLearnSession = {
  version: number;
  datasetVersion: string;
  savedAt: string;
  engine: LearnEngineState;
  choiceOrderByQuestionId: Record<string, string[]>;
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

const isValidEngine = (engine: LearnEngineState | null | undefined): engine is LearnEngineState => {
  if (!engine) return false;
  return Array.isArray(engine.allIds)
    && typeof engine.batchSize === 'number'
    && typeof engine.masteryTarget === 'number'
    && typeof engine.batchStartIndex === 'number'
    && Array.isArray(engine.batchIds)
    && Array.isArray(engine.queue)
    && typeof engine.statsById === 'object'
    && 'currentQuestionId' in engine
    && typeof engine.sessionComplete === 'boolean';
};

export const loadScenarioLearnSession = (): PersistedScenarioLearnSession | null => {
  if (!isBrowser()) return null;
  return safeParseJSON<PersistedScenarioLearnSession>(window.localStorage.getItem(STORAGE_KEY));
};

export const saveScenarioLearnSession = (payload: {
  datasetVersion: string;
  engine: LearnEngineState;
  choiceOrderByQuestionId: Record<string, string[]>;
}): void => {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: VERSION,
    datasetVersion: payload.datasetVersion,
    savedAt: new Date().toISOString(),
    engine: payload.engine,
    choiceOrderByQuestionId: payload.choiceOrderByQuestionId
  } satisfies PersistedScenarioLearnSession));
};

export const clearScenarioLearnSession = (): void => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const restoreOrInitializeScenarioLearn = (params: {
  allIds: string[];
  batchSize: number;
  masteryTarget: number;
  datasetVersion: string;
  choiceOrderByQuestionId: Record<string, string[]>;
}): { engine: LearnEngineState; choiceOrderByQuestionId: Record<string, string[]>; resetReason?: 'version_mismatch' | 'corrupt' } => {
  const freshEngine = initializeLearnEngine(params.allIds, params.batchSize, params.masteryTarget);
  const saved = loadScenarioLearnSession();

  if (!saved || saved.version !== VERSION) {
    return { engine: freshEngine, choiceOrderByQuestionId: params.choiceOrderByQuestionId };
  }

  if (saved.datasetVersion !== params.datasetVersion) {
    clearScenarioLearnSession();
    return { engine: freshEngine, choiceOrderByQuestionId: params.choiceOrderByQuestionId, resetReason: 'version_mismatch' };
  }

  if (!isValidEngine(saved.engine) || !saved.choiceOrderByQuestionId || typeof saved.choiceOrderByQuestionId !== 'object') {
    clearScenarioLearnSession();
    return { engine: freshEngine, choiceOrderByQuestionId: params.choiceOrderByQuestionId, resetReason: 'corrupt' };
  }

  return {
    engine: {
      ...saved.engine,
      allIds: params.allIds,
      batchSize: params.batchSize,
      masteryTarget: params.masteryTarget
    },
    choiceOrderByQuestionId: saved.choiceOrderByQuestionId
  };
};
