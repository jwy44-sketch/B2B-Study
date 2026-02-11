import type { Question } from './types';

const simpleHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
};

export const computeDatasetVersion = (questions: Question[]): string => {
  const count = questions.length;
  const first = questions[0]?.id ?? 'none';
  const last = questions[count - 1]?.id ?? 'none';
  const signature = questions.map((q) => `${q.id}:${q.prompt}`).join('|');
  const hash = simpleHash(signature).slice(0, 8);
  return `con3910-${count}-${first}-${last}-${hash}`;
};
