export type PracticeMode = 'random' | 'sequential';

export type PracticeSession = {
  ids: string[];
  index: number;
  answers: Record<string, { selectedIndex: number | null; isCorrect: boolean }>;
  startedAt: number;
  timerMode: 'off' | 'stopwatch' | 'countdown';
  countdownSeconds: number;
};

export const createPracticeSession = (
  allIds: string[],
  count: number,
  mode: PracticeMode,
  timerMode: PracticeSession['timerMode'],
  countdownSeconds: number
): PracticeSession => {
  const base = mode === 'random' ? [...allIds].sort(() => Math.random() - 0.5) : [...allIds];
  return {
    ids: base.slice(0, Math.min(count, allIds.length)),
    index: 0,
    answers: {},
    startedAt: Date.now(),
    timerMode,
    countdownSeconds
  };
};

export const submitPracticeAnswer = (
  session: PracticeSession,
  questionId: string,
  selectedIndex: number | null,
  correctIndex: number
): PracticeSession => {
  const nextIndex = Math.min(session.index + 1, session.ids.length);
  return {
    ...session,
    index: nextIndex,
    answers: {
      ...session.answers,
      [questionId]: {
        selectedIndex,
        isCorrect: selectedIndex === correctIndex
      }
    }
  };
};

export const practiceScore = (session: PracticeSession) => {
  const total = session.ids.length;
  const correct = Object.values(session.answers).filter((answer) => answer.isCorrect).length;
  return {
    correct,
    total,
    accuracyPct: total ? Math.round((correct / total) * 100) : 0
  };
};
