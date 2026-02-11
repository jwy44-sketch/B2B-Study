export type LearnStats = {
  attempts: number;
  incorrectCount: number;
  correctStreak: number;
  mastered: boolean;
  seen: boolean;
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
  seen: false
});

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
    statsById[id] = statsById[id] ?? defaultStats();
  });

  const unmastered = batchIds.filter((id) => !statsById[id].mastered);
  const queue = unmastered.length ? unmastered : [];

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

  const existing = state.statsById[questionId] ?? defaultStats();
  const updatedStats: LearnStats = {
    ...existing,
    attempts: existing.attempts + 1,
    seen: true,
    lastAnsweredAt: new Date().toISOString(),
    correctStreak: isCorrect ? existing.correctStreak + 1 : 0,
    incorrectCount: isCorrect ? existing.incorrectCount : existing.incorrectCount + 1
  };
  updatedStats.mastered = updatedStats.correctStreak >= state.masteryTarget;

  const statsById = {
    ...state.statsById,
    [questionId]: updatedStats
  };

  const restQueue = state.queue.filter((id, idx) => !(idx === 0 && id === questionId));
  const shouldRequeue = !updatedStats.mastered;
  const queue = shouldRequeue ? [...restQueue, questionId] : restQueue;

  const reviewingMissed = queue.length > 0 && state.batchIds.every((id) => (statsById[id]?.seen ?? false));

  const intermediate: LearnState = {
    ...state,
    statsById,
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
