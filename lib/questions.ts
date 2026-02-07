import { Question } from './types';

export async function loadQuestions(): Promise<Question[]> {
  const res = await fetch('/questions.json');
  if (!res.ok) throw new Error('Failed loading questions');
  return (await res.json()) as Question[];
}
