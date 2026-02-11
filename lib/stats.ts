import type { LearnStats } from './learnEngine';
import { inferFarRef } from './farReferences';
import type { Question } from './types';

type PartStats = {
  part: number;
  title: string;
  attempts: number;
  incorrect: number;
  accuracyPct: number;
  masteredPct: number;
};

export const computeOverallStats = (questions: Question[], statsById: Record<string, LearnStats>) => {
  let totalAttempts = 0;
  let totalIncorrect = 0;
  let masteredCount = 0;

  questions.forEach((question) => {
    const stats = statsById[question.id];
    if (!stats) return;
    totalAttempts += stats.attempts;
    totalIncorrect += stats.incorrectCount;
    if (stats.mastered) masteredCount += 1;
  });

  const totalCorrect = Math.max(0, totalAttempts - totalIncorrect);
  return {
    totalAttempts,
    totalCorrect,
    totalIncorrect,
    masteredCount,
    accuracyPct: totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  };
};

export const computePartStats = (questions: Question[], statsById: Record<string, LearnStats>): PartStats[] => {
  const grouped = new Map<number, { title: string; ids: string[] }>();

  questions.forEach((question) => {
    const ref = inferFarRef(question.prompt);
    const existing = grouped.get(ref.part);
    if (existing) {
      existing.ids.push(question.id);
      return;
    }

    grouped.set(ref.part, { title: ref.title, ids: [question.id] });
  });

  return [...grouped.entries()].map(([part, payload]) => {
    let attempts = 0;
    let incorrect = 0;
    let mastered = 0;

    payload.ids.forEach((id) => {
      const stats = statsById[id];
      if (!stats) return;
      attempts += stats.attempts;
      incorrect += stats.incorrectCount;
      if (stats.mastered) mastered += 1;
    });

    const accuracyPct = attempts ? Math.round(((attempts - incorrect) / attempts) * 100) : 0;
    const masteredPct = payload.ids.length ? Math.round((mastered / payload.ids.length) * 100) : 0;

    return {
      part,
      title: payload.title,
      attempts,
      incorrect,
      accuracyPct,
      masteredPct
    };
  }).sort((a, b) => a.part - b.part);
};

export const mostMissedQuestions = (questions: Question[], statsById: Record<string, LearnStats>, limit = 8) => {
  return questions
    .map((question) => ({
      question,
      incorrectCount: statsById[question.id]?.incorrectCount ?? 0
    }))
    .filter((entry) => entry.incorrectCount > 0)
    .sort((a, b) => b.incorrectCount - a.incorrectCount)
    .slice(0, limit);
};

export const buildInsights = (partStats: PartStats[]) => {
  const withAttempts = partStats.filter((part) => part.attempts > 0);
  if (!withAttempts.length) {
    return {
      strongest: 'No attempts yet.',
      weakest: 'No attempts yet.'
    };
  }

  const strongest = [...withAttempts].sort((a, b) => b.accuracyPct - a.accuracyPct)[0];
  const weakest = [...withAttempts].sort((a, b) => a.accuracyPct - b.accuracyPct)[0];

  return {
    strongest: `Strongest area: FAR Part ${strongest.part} (${strongest.accuracyPct}% accuracy).`,
    weakest: `Weakest area: FAR Part ${weakest.part} (${weakest.accuracyPct}% accuracy).`
  };
};
