import { Question } from './types';

export async function loadQuestions(): Promise<Question[]> {
  const res = await fetch('/questions.json');
  if (!res.ok) throw new Error('Failed loading questions');
  const raw = (await res.json()) as Question[];
  return raw.map((q) => ({
    ...q,
    stem: q.stem ?? q.prompt ?? '',
    prompt: q.prompt ?? q.stem ?? '',
    explanation: q.explanation ?? {
      whyCorrect: q.explanationRich?.whyCorrect ?? 'Review the governing FAR logic and choose the compliant path.',
      keyTakeaway: q.explanationRich?.whatThisTests ?? 'Identify the governing FAR rule before selecting an action.',
      commonTrap: q.explanationRich?.whyWrong?.[0]?.reason ?? 'Avoid options that skip documentation or authority checks.'
    }
  }));
}
