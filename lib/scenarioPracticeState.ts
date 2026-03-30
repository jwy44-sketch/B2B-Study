import type { ScenarioQuestion } from './scenarioTypes';


const CHUNK_NUMBERS = Array.from({ length: 30 }, (_, i) => i + 121);

function normalizeId(id: string): string {
  return id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function expectedChunkTokens(n: number): string[] {
  const padded = String(n).padStart(3, '0');
  return [`Q${padded}`, `SCN${padded}`];
}

export function selectScenarioPracticeChunkQuestions(questions: ScenarioQuestion[]): ScenarioQuestion[] {
  const byNormalizedId = new Map(questions.map((q) => [normalizeId(q.id), q]));
  return CHUNK_NUMBERS
    .map((n) => expectedChunkTokens(n).map((token) => byNormalizedId.get(token)).find(Boolean) ?? null)
    .filter((q): q is ScenarioQuestion => Boolean(q));
}

export type ScenarioPracticeProgress = {
  sessionId: string;
  questionOrder: string[];
  choiceOrderByQuestion: Record<string, string[]>;
  currentIndex: number;
  answers: Record<string, { selectedChoiceId: string; isCorrect: boolean }>;
  completed: boolean;
};

function shuffle<T>(input: T[]): T[] {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildChoiceOrderByQuestion(questions: ScenarioQuestion[]): Record<string, string[]> {
  return Object.fromEntries(
    questions.map((q) => [q.id, shuffle(q.choices.map((c) => c.id))])
  );
}

export function createScenarioPracticeProgress(questions: ScenarioQuestion[], questionOrder?: string[]): ScenarioPracticeProgress {
  return {
    sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    questionOrder: questionOrder ?? shuffle(questions.map((q) => q.id)),
    choiceOrderByQuestion: buildChoiceOrderByQuestion(questions),
    currentIndex: 0,
    answers: {},
    completed: false
  };
}

export function normalizeSavedScenarioPracticeProgress(saved: ScenarioPracticeProgress, questions: ScenarioQuestion[]): ScenarioPracticeProgress {
  const questionIds = new Set(questions.map((q) => q.id));
  const sanitizedAnswers = Object.fromEntries(
    Object.entries(saved.answers).filter(([questionId]) => questionIds.has(questionId))
  );
  const firstUnansweredIndex = saved.questionOrder.findIndex((questionId) => !sanitizedAnswers[questionId]);
  const allAnswered = firstUnansweredIndex === -1;

  return {
    ...saved,
    answers: sanitizedAnswers,
    currentIndex: allAnswered ? saved.questionOrder.length : firstUnansweredIndex,
    completed: saved.completed || allAnswered
  };
}

export function findNextUnansweredIndex(progress: ScenarioPracticeProgress, fromIndex = 0): number {
  for (let i = fromIndex; i < progress.questionOrder.length; i += 1) {
    const questionId = progress.questionOrder[i];
    if (!progress.answers[questionId]) return i;
  }
  return -1;
}

export function isValidSavedScenarioPracticeProgress(saved: ScenarioPracticeProgress | null, questions: ScenarioQuestion[]): saved is ScenarioPracticeProgress {
  if (!saved) return false;
  const questionIds = new Set(questions.map((q) => q.id));
  if (saved.questionOrder.length !== questions.length) return false;
  if (new Set(saved.questionOrder).size !== saved.questionOrder.length) return false;
  if (!saved.questionOrder.every((id) => questionIds.has(id))) return false;
  if (Object.keys(saved.choiceOrderByQuestion).length !== questions.length) return false;
  if (saved.currentIndex < 0 || saved.currentIndex > questions.length) return false;
  return true;
}
