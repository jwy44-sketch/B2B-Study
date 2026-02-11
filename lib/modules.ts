import type { Question } from './types';
import type { LearnStats } from './learnEngine';
import { inferFarRef } from './farReferences';

export type StudyModule = {
  id: string;
  title: string;
  farRef: { part: number; title: string; url: string };
  questionIds: string[];
  counts: {
    total: number;
    mastered: number;
    masteredPct: number;
  };
};

export const buildModules = (
  questions: Question[],
  statsById: Record<string, LearnStats> = {}
): StudyModule[] => {
  const grouped = new Map<number, { farRef: ReturnType<typeof inferFarRef>; ids: string[] }>();

  questions.forEach((question) => {
    const farRef = inferFarRef(question.prompt);
    const current = grouped.get(farRef.part);
    if (current) {
      current.ids.push(question.id);
      return;
    }

    grouped.set(farRef.part, { farRef, ids: [question.id] });
  });

  return [...grouped.values()]
    .sort((a, b) => a.farRef.part - b.farRef.part)
    .map(({ farRef, ids }) => {
      const mastered = ids.filter((id) => statsById[id]?.mastered).length;
      return {
        id: `far-${farRef.part}`,
        title: `FAR Part ${farRef.part} — ${farRef.title}`,
        farRef,
        questionIds: ids,
        counts: {
          total: ids.length,
          mastered,
          masteredPct: ids.length ? Math.round((mastered / ids.length) * 100) : 0
        }
      };
    });
};

export const getModuleById = (
  moduleId: string,
  questions: Question[],
  statsById: Record<string, LearnStats> = {}
): StudyModule | null => {
  return buildModules(questions, statsById).find((moduleEntry) => moduleEntry.id === moduleId) ?? null;
};
