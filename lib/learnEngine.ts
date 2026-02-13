export type LearnStats = {
  attempts: number;
  incorrectCount: number;
  correctStreak: number;
  mastered: boolean;
  seen: boolean;
  intervalStep?: number;
  dueAt?: string;
  lastResult?: 'correct' | 'wrong';
  lastAnsweredAt?: string;
};

export type LearnState = {
  allIds: string[];
  batchSize: number;
  masteryTarget: number;
  batchStartIndex: number;
  batchIds: string[];
  queue: string[];
  statsById: Record<string, LearnStats>;
  currentQuestionId: string | null;
  sessionComplete: boolean;
  reviewingMissed: boolean;
  completed: boolean;
};

export type LearnEngineState = LearnState;
export type LearnQuestionStats = LearnStats;

const defaultStats = (): LearnStats => ({
  attempts: 0,
  incorrectCount: 0,
  correctStreak: 0,
  mastered: false,
  seen: false,
  intervalStep: 0
});

const STEP_DELAYS_MS = [30_000, 120_000, 600_000];
const WRONG_DELAY_MS = 20_000;

const dueTime = (stats: LearnStats): number => {
  if (!stats.dueAt) return 0;
  const parsed = new Date(stats.dueAt).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const clampStep = (step: number): number => {
  return Math.max(0, Math.min(step, STEP_DELAYS_MS.length - 1));
};

const orderDueQueue = (batchIds: string[], statsById: Record<string, LearnStats>): string[] => {
  return batchIds
    .filter((id) => !statsById[id]?.mastered)
    .sort((a, b) => {
      const aStats = statsById[a] ?? defaultStats();
      const bStats = statsById[b] ?? defaultStats();
      const dueDiff = dueTime(aStats) - dueTime(bStats);
      if (dueDiff !== 0) return dueDiff;
      const missPriority = (bStats.incorrectCount ?? 0) - (aStats.incorrectCount ?? 0);
      if (missPriority !== 0) return missPriority;
      return (aStats.correctStreak ?? 0) - (bStats.correctStreak ?? 0);
    });
};

const applyWeightedResult = (
  state: LearnState,
  questionId: string,
  isCorrect: boolean,
  now = Date.now()
): LearnState => {
  const existing = state.statsById[questionId] ?? defaultStats();
  const nextCorrectStreak = isCorrect ? existing.correctStreak + 1 : 0;
  const mastered = nextCorrectStreak >= state.masteryTarget;
  const nextStep = isCorrect ? clampStep((existing.intervalStep ?? 0) + 1) : 0;
  const delayMs = isCorrect ? STEP_DELAYS_MS[nextStep] : WRONG_DELAY_MS;

  const updatedStats: LearnStats = {
    ...existing,
    attempts: existing.attempts + 1,
    seen: true,
    lastResult: isCorrect ? 'correct' : 'wrong',
    lastAnsweredAt: new Date(now).toISOString(),
    incorrectCount: isCorrect ? existing.incorrectCount : existing.incorrectCount + 1,
    correctStreak: nextCorrectStreak,
    mastered,
    intervalStep: nextStep,
    dueAt: new Date(now + delayMs).toISOString()
  };

  return {
    ...state,
    statsById: {
      ...state.statsById,
      [questionId]: updatedStats
    }
  };
};

export const recordQuestionResult = (state: LearnState, questionId: string, isCorrect: boolean): LearnState => {
  return applyWeightedResult(state, questionId, isCorrect);
};

const withBatch = (state: LearnState): LearnState => {
  const batchIds = state.allIds.slice(state.batchStartIndex, state.batchStartIndex + state.batchSize);
  if (!batchIds.length) {
    return {
      ...state,
      batchIds: [],
      queue: [],
      currentQuestionId: null,
      sessionComplete: true,
      reviewingMissed: false,
      completed: true
    };
  }

  const statsById = { ...state.statsById };
  batchIds.forEach((id) => {
    const existing = statsById[id] ?? defaultStats();
    statsById[id] = {
      ...existing,
      dueAt: existing.dueAt ?? new Date().toISOString(),
      intervalStep: existing.intervalStep ?? 0
    };
  });

  const queue = orderDueQueue(batchIds, statsById);

  return {
    ...state,
    batchIds,
    queue,
    statsById,
    currentQuestionId: queue[0] ?? null,
    sessionComplete: false,
    reviewingMissed: false,
    completed: false
  };
};

export const initLearn = (allIds: string[], batchStartIndex = 0, batchSize = 10, masteryTarget = 2): LearnState => {
  const base: LearnState = {
    allIds,
    batchSize,
    masteryTarget,
    batchStartIndex,
    batchIds: [],
    queue: [],
    statsById: {},
    currentQuestionId: null,
    sessionComplete: false,
    reviewingMissed: false,
    completed: false
  };
  return withBatch(base);
};

export const initializeLearnEngine = (allIds: string[], batchSize = 10, masteryTarget = 2): LearnState => {
  return initLearn(allIds, 0, batchSize, masteryTarget);
};

export const getNextQuestionId = (state: LearnState): string | null => {
  return state.queue[0] ?? null;
};

export const getBatchMetrics = (state: LearnState) => {
  const masteredCount = state.batchIds.filter((id) => state.statsById[id]?.mastered).length;
  const totalInBatch = state.batchIds.length;
  const remaining = Math.max(0, totalInBatch - masteredCount);
  const progressPct = totalInBatch ? Math.round((masteredCount / totalInBatch) * 100) : 0;
  const totalBatches = Math.max(1, Math.ceil(state.allIds.length / state.batchSize));
  return {
    masteredCount,
    totalInBatch,
    remaining,
    progressPct,
    batchNumber: Math.floor(state.batchStartIndex / state.batchSize) + 1,
    totalBatches
  };
};

export const getBatchMastery = (state: LearnState) => {
  const metrics = getBatchMetrics(state);
  return {
    masteredCount: metrics.masteredCount,
    batchSize: metrics.totalInBatch,
    remainingInBatch: metrics.remaining,
    batchNumber: metrics.batchNumber,
    totalBatches: metrics.totalBatches,
    progressPct: metrics.progressPct
  };
};

export const advanceBatchIfComplete = (state: LearnState, allIds = state.allIds): LearnState => {
  if (state.queue.length > 0) {
    return { ...state, currentQuestionId: state.queue[0] ?? null };
  }

  const nextStart = state.batchStartIndex + state.batchSize;
  if (nextStart >= allIds.length) {
    return {
      ...state,
      allIds,
      currentQuestionId: null,
      sessionComplete: true,
      reviewingMissed: false,
      completed: true
    };
  }

  return withBatch({
    ...state,
    allIds,
    batchStartIndex: nextStart,
    batchIds: [],
    queue: [],
    currentQuestionId: null,
    reviewingMissed: false
  });
};

export const submitAnswer = (state: LearnState, questionId: string, isCorrect: boolean): LearnState => {
  if (!questionId || state.sessionComplete) return state;

  const updated = applyWeightedResult(state, questionId, isCorrect);
  const queue = orderDueQueue(state.batchIds, updated.statsById);

  const reviewingMissed = queue.length > 0 && state.batchIds.every((id) => (updated.statsById[id]?.seen ?? false));

  const intermediate: LearnState = {
    ...updated,
    queue,
    reviewingMissed,
    currentQuestionId: queue[0] ?? null
  };

  return advanceBatchIfComplete(intermediate, state.allIds);
};

export const submitLearnAnswer = (state: LearnState, wasCorrect: boolean): LearnState => {
  const questionId = state.currentQuestionId;
  if (!questionId) return state;
  return submitAnswer(state, questionId, wasCorrect);
};

export const restartLearnEngine = (state: LearnState): LearnState => {
  return initLearn(state.allIds, 0, state.batchSize, state.masteryTarget);
};
