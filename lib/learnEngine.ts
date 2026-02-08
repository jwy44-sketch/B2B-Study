export type LearnQuestionStats = {
  attempts: number;
  incorrectCount: number;
  correctStreak: number;
  mastered: boolean;
  seen: boolean;
};

export type LearnEngineState = {
  allIds: string[];
  batchSize: number;
  masteryTarget: number;
  batchStartIndex: number;
  batchIds: string[];
  queue: string[];
  stats: Record<string, LearnQuestionStats>;
  currentQuestionId: string | null;
  sessionComplete: boolean;
  reviewingMissed: boolean;
};

const defaultStats = (): LearnQuestionStats => ({
  attempts: 0,
  incorrectCount: 0,
  correctStreak: 0,
  mastered: false,
  seen: false
});

const hydrateBatch = (state: LearnEngineState): LearnEngineState => {
  const batchIds = state.allIds.slice(state.batchStartIndex, state.batchStartIndex + state.batchSize);

  if (!batchIds.length) {
    return {
      ...state,
      batchIds: [],
      queue: [],
      currentQuestionId: null,
      sessionComplete: true,
      reviewingMissed: false
    };
  }

  const stats = { ...state.stats };
  for (const id of batchIds) {
    stats[id] = stats[id] ?? defaultStats();
  }

  return {
    ...state,
    batchIds,
    queue: [...batchIds],
    stats,
    currentQuestionId: batchIds[0],
    sessionComplete: false,
    reviewingMissed: false
  };
};

export const initializeLearnEngine = (allIds: string[], batchSize = 10, masteryTarget = 2): LearnEngineState => {
  return hydrateBatch({
    allIds,
    batchSize,
    masteryTarget,
    batchStartIndex: 0,
    batchIds: [],
    queue: [],
    stats: {},
    currentQuestionId: null,
    sessionComplete: false,
    reviewingMissed: false
  });
};

export const restartLearnEngine = (state: LearnEngineState): LearnEngineState => {
  return initializeLearnEngine(state.allIds, state.batchSize, state.masteryTarget);
};

const goToNextBatch = (state: LearnEngineState): LearnEngineState => {
  return hydrateBatch({
    ...state,
    batchStartIndex: state.batchStartIndex + state.batchSize,
    batchIds: [],
    queue: [],
    currentQuestionId: null,
    reviewingMissed: false
  });
};

export const submitLearnAnswer = (state: LearnEngineState, wasCorrect: boolean): LearnEngineState => {
  const currentId = state.currentQuestionId;
  if (!currentId || state.sessionComplete) return state;

  const stats = { ...state.stats };
  const current = { ...(stats[currentId] ?? defaultStats()) };
  current.attempts += 1;
  current.seen = true;

  if (wasCorrect) {
    current.correctStreak += 1;
    if (current.correctStreak >= state.masteryTarget) {
      current.mastered = true;
    }
  } else {
    current.correctStreak = 0;
    current.incorrectCount += 1;
    current.mastered = false;
  }

  stats[currentId] = current;

  const [, ...restQueue] = state.queue;
  const shouldRequeue = !current.mastered;
  const nextQueue = shouldRequeue ? [...restQueue, currentId] : restQueue;

  const reviewingMissed = nextQueue.length > 0 && state.batchIds.every((id) => (stats[id]?.seen ?? false));

  if (!nextQueue.length) {
    return goToNextBatch({
      ...state,
      stats,
      reviewingMissed
    });
  }

  return {
    ...state,
    stats,
    queue: nextQueue,
    currentQuestionId: nextQueue[0],
    reviewingMissed
  };
};

export const getBatchMastery = (state: LearnEngineState) => {
  const masteredCount = state.batchIds.filter((id) => state.stats[id]?.mastered).length;
  return {
    masteredCount,
    batchSize: state.batchIds.length,
    remainingInBatch: Math.max(0, state.batchIds.length - masteredCount),
    batchNumber: Math.floor(state.batchStartIndex / state.batchSize) + 1
  };
};
