import { loadQuestions } from './questions';

export type NormalizedQuestion = {
  id: string;
  stem: string;
  choices: string[];
  correctIndex?: number;
  explanationText?: string;
};

const normalizeExplanation = (raw: unknown): string | undefined => {
  if (!raw) return undefined;
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') {
    const maybe = raw as { whyCorrect?: string; keyTakeaway?: string; commonTrap?: string };
    return [maybe.whyCorrect, maybe.commonTrap, maybe.keyTakeaway].filter(Boolean).join(' ');
  }
  return undefined;
};

export async function loadNormalizedQuestionBank(): Promise<NormalizedQuestion[]> {
  const questions = await loadQuestions();
  return questions.map((question) => ({
    id: question.id,
    stem: question.prompt,
    choices: [...question.choices],
    correctIndex: Number.isInteger(question.correctIndex) ? question.correctIndex : undefined,
    explanationText: normalizeExplanation(question.explanation)
  }));
}
