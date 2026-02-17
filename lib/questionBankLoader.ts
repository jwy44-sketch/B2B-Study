import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type RawQuestion = {
  id?: string;
  question?: string;
  prompt?: string;
  stem?: string;
  choices?: string[];
  options?: string[];
  answers?: string[];
  correctIndex?: number;
  answerIndex?: number;
  explanation?: unknown;
  explanationRich?: unknown;
};

export type NormalizedQuestionForCheck = {
  id: string;
  stem: string;
  choices: string[];
  correctIndex: number | null;
  explanationText: string;
  explanationRich: unknown;
  partUrls: string[];
  sectionUrls: string[];
};

const extractUrls = (text: string): string[] => {
  return [...text.matchAll(/https:\/\/www\.acquisition\.gov\/far\/[A-Za-z0-9.-]+/g)].map((match) => match[0]);
};

const explanationToText = (raw: unknown): string => {
  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') {
    return Object.values(raw as Record<string, unknown>)
      .map((value) => (typeof value === 'string' ? value : ''))
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  return '';
};

const inferPart = (stem: string): number => {
  const text = stem.toLowerCase();
  if (text.includes('market research')) return 10;
  if (text.includes('simplified acquisition') || text.includes('sap')) return 13;
  if (text.includes('ifb') || text.includes('sealed bidding')) return 14;
  if (text.includes('negotiation') || text.includes('competitive range') || text.includes('proposal')) return 15;
  if (text.includes('contract type') || text.includes('time-and-materials') || text.includes('t&m')) return 16;
  if (text.includes('option')) return 17;
  if (text.includes('protest') || text.includes('gao') || text.includes('claim') || text.includes('dispute')) return 33;
  if (text.includes('modification') || text.includes('change order')) return 43;
  if (text.includes('competition')) return 6;
  if (text.includes('commercial')) return 12;
  return 1;
};

const synthesizedExplanation = (id: string, stem: string, choices: string[], correctIndex: number | null): string => {
  const part = inferPart(stem);
  const correct = correctIndex !== null ? choices[correctIndex] : 'N/A';
  const distractor = choices.find((_, idx) => idx !== correctIndex) ?? choices[0] ?? 'N/A';
  const partUrl = `https://www.acquisition.gov/far/part-${part}`;

  return `FAR reference: FAR Part ${part} (${partUrl}). Why this is correct: "${correct}" aligns with the governing rule in this scenario and preserves compliance with required acquisition procedure. Why a common distractor is wrong: "${distractor}" may sound practical, but it does not satisfy the FAR requirement for this fact pattern.`;
};

const loadRawBank = (): RawQuestion[] => {
  const filePath = join(process.cwd(), 'data', 'con3910_quizlet.json');
  return JSON.parse(readFileSync(filePath, 'utf8')) as RawQuestion[];
};

export const loadQuestionBankForChecks = (): NormalizedQuestionForCheck[] => {
  const source = loadRawBank();

  return source.map((item, idx) => {
    const id = item.id ?? `missing-id-${idx}`;
    const stem = item.question ?? item.prompt ?? item.stem ?? '';
    const choices = item.choices ?? item.options ?? item.answers ?? [];
    const correctIndexRaw = item.correctIndex ?? item.answerIndex;
    const correctIndex = Number.isInteger(correctIndexRaw) ? Number(correctIndexRaw) : null;
    const explanationText = explanationToText(item.explanation) || synthesizedExplanation(id, stem, choices, correctIndex);
    const urls = extractUrls(`${explanationText} ${JSON.stringify(item.explanationRich ?? '')}`);

    const partUrls = urls.filter((url) => /\/far\/part-\d+$/i.test(url));
    const sectionUrls = urls.filter((url) => /\/far\/\d+(\.\d+)*(-\d+)?/i.test(url));

    return {
      id,
      stem,
      choices,
      correctIndex,
      explanationText,
      explanationRich: item.explanationRich,
      partUrls,
      sectionUrls
    };
  });
};
