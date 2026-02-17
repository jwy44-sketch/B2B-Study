import type { LearnState, LearnStats } from './learnEngine';

const MINUTE_MS = 60_000;
const STEPS_IN_MINUTES = [1, 5, 20, 60, 360, 1440];

const getDelayMs = (step: number) => {
  const bounded = Math.max(0, Math.min(step, STEPS_IN_MINUTES.length - 1));
  return STEPS_IN_MINUTES[bounded] * MINUTE_MS;
};

export const scheduleSrs = (stats: LearnStats, isCorrect: boolean, now = Date.now()): LearnStats => {
  const step = isCorrect ? (stats.intervalStep ?? 0) + 1 : 0;
  const dueAt = now + getDelayMs(step);
  return {
    ...stats,
    intervalStep: step,
    dueAt,
    lastResult: isCorrect ? 'correct' : 'wrong'
  };
};

export const applySrsResult = (state: LearnState, questionId: string, isCorrect: boolean, now = Date.now()): LearnState => {
  const current = state.statsById[questionId];
  if (!current) return state;

  const updated = scheduleSrs(current, isCorrect, now);
  const statsById = { ...state.statsById, [questionId]: updated };
  const queue = [...state.queue].sort((a, b) => {
    const aDue = typeof statsById[a]?.dueAt === 'number' ? statsById[a].dueAt as number : 0;
    const bDue = typeof statsById[b]?.dueAt === 'number' ? statsById[b].dueAt as number : 0;
    return aDue - bDue;
  });

  return {
    ...state,
    statsById,
    queue,
    currentQuestionId: queue[0] ?? null
  };
};
