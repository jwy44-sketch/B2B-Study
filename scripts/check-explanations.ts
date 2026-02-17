import { loadQuestionBankForChecks, type NormalizedQuestionForCheck } from '../lib/questionBankLoader.ts';

type Issue = { id: string; message: string };

type SimilarityPair = { a: string; b: string; score: number };

const BANNED_PHRASES = [
  'governing far',
  'controlling far',
  'this scenario',
  'fact pattern',
  'expedient',
  'key takeaway: use the governing',
  'aligns with the far',
  'matches the controlling',
  'explanation unavailable'
];

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'for', 'on', 'with', 'by', 'is', 'are', 'it', 'this', 'that',
  'as', 'be', 'from', 'at', 'if', 'when', 'which', 'what', 'how', 'why', 'you', 'your', 'they', 'their', 'under'
]);

const normalize = (value: string): string[] => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOPWORDS.has(token));
};

const trigrams = (tokens: string[]): Set<string> => {
  if (tokens.length < 3) return new Set(tokens);
  const out = new Set<string>();
  for (let i = 0; i <= tokens.length - 3; i += 1) {
    out.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
  }
  return out;
};

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
};

const explanationText = (q: NormalizedQuestionForCheck): string => {
  const rich = q.explanationRich && typeof q.explanationRich === 'object' ? JSON.stringify(q.explanationRich) : '';
  return `${q.explanationText} ${rich}`.trim();
};

const checkStructure = (question: NormalizedQuestionForCheck, warnings: Issue[]): void => {
  if (!question.explanationRich || typeof question.explanationRich !== 'object') return;
  const rich = question.explanationRich as Record<string, unknown>;
  const decisionProcess = Array.isArray(rich.decisionProcess) ? rich.decisionProcess : [];
  const whyWrong = Array.isArray(rich.whyWrong) ? rich.whyWrong : [];
  const whyCorrect = typeof rich.whyCorrect === 'string' ? rich.whyCorrect : '';
  const fieldTip = typeof rich.fieldTip === 'string' ? rich.fieldTip : '';

  if (decisionProcess.length < 2) warnings.push({ id: question.id, message: 'explanationRich.decisionProcess has fewer than 2 steps' });
  if (whyWrong.length < 2) warnings.push({ id: question.id, message: 'explanationRich.whyWrong has fewer than 2 distractor explanations' });
  if (whyCorrect.length < 80) warnings.push({ id: question.id, message: 'explanationRich.whyCorrect is shorter than 80 characters' });
  if (fieldTip.length < 30) warnings.push({ id: question.id, message: 'explanationRich.fieldTip is shorter than 30 characters' });
};

const main = () => {
  const questions = loadQuestionBankForChecks();

  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const bannedCounts = new Map<string, number>();
  const missingExplanationIds: string[] = [];
  const missingFarPartIds: string[] = [];

  const seenIds = new Set<string>();

  for (const question of questions) {
    if (!question.id || question.id.startsWith('missing-id-')) {
      errors.push({ id: question.id, message: 'missing stable id' });
    } else if (seenIds.has(question.id)) {
      errors.push({ id: question.id, message: 'duplicate id' });
    } else {
      seenIds.add(question.id);
    }

    if (!question.stem || question.stem.length < 20) {
      errors.push({ id: question.id, message: 'missing stem or stem shorter than 20 chars' });
    }

    if (!Array.isArray(question.choices) || question.choices.length < 2) {
      errors.push({ id: question.id, message: 'choices/options array missing or too short' });
    }

    if (question.correctIndex === null || question.correctIndex < 0 || question.correctIndex >= question.choices.length) {
      errors.push({ id: question.id, message: 'correct index missing or out of range' });
    }

    const text = explanationText(question);
    if (!text || text.length < 120) {
      errors.push({ id: question.id, message: 'explanation missing or too short (<120 chars)' });
      missingExplanationIds.push(question.id);
    }

    if (!question.partUrls.length) {
      errors.push({ id: question.id, message: 'missing FAR Part link' });
      missingFarPartIds.push(question.id);
    }

    question.partUrls.forEach((url) => {
      if (!/^https:\/\/www\.acquisition\.gov\/far\/part-\d+$/i.test(url)) {
        errors.push({ id: question.id, message: `invalid FAR Part URL: ${url}` });
      }
    });

    question.sectionUrls.forEach((url) => {
      if (!/^https:\/\/www\.acquisition\.gov\/far\/\d+(\.\d+)*(-\d+)?/i.test(url)) {
        errors.push({ id: question.id, message: `invalid FAR section URL: ${url}` });
      }
    });

    const lower = text.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) {
        bannedCounts.set(phrase, (bannedCounts.get(phrase) ?? 0) + 1);
        warnings.push({ id: question.id, message: `contains banned phrase: "${phrase}"` });
      }
    }

    checkStructure(question, warnings);
  }

  const pairs: SimilarityPair[] = [];
  for (let i = 0; i < questions.length; i += 1) {
    const qa = questions[i];
    const ta = trigrams(normalize(explanationText(qa)));
    for (let j = i + 1; j < questions.length; j += 1) {
      const qb = questions[j];
      const tb = trigrams(normalize(explanationText(qb)));
      const score = jaccard(ta, tb);
      if (score > 0.7) {
        pairs.push({ a: qa.id, b: qb.id, score });
      }
    }
  }

  if (pairs.length > 0) {
    pairs.forEach((pair) => {
      warnings.push({ id: `${pair.a}/${pair.b}`, message: `too similar (${pair.score.toFixed(2)})` });
    });
  }

  const bannedTotal = [...bannedCounts.values()].reduce((a, b) => a + b, 0);

  const fail = errors.length > 0 || pairs.length > 5 || bannedTotal > 10;

  console.log('=== Explanation Quality Report ===');
  console.log(`Total questions: ${questions.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log('');

  if (missingExplanationIds.length) {
    console.log(`Missing explanations (${missingExplanationIds.length}): ${missingExplanationIds.join(', ')}`);
  }

  if (missingFarPartIds.length) {
    console.log(`Missing FAR Part links (${missingFarPartIds.length}): ${missingFarPartIds.join(', ')}`);
  }

  console.log('');
  console.log('Top 10 similarity pairs:');
  pairs
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((pair) => {
      console.log(`- ${pair.a} <-> ${pair.b}: ${pair.score.toFixed(2)}`);
    });

  console.log('');
  console.log('Banned phrase counts:');
  [...bannedCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([phrase, count]) => {
      console.log(`- "${phrase}": ${count}`);
    });

  if (errors.length) {
    console.log('');
    console.log('Errors:');
    errors.slice(0, 50).forEach((issue) => console.log(`- [${issue.id}] ${issue.message}`));
  }

  if (warnings.length) {
    console.log('');
    console.log('Warnings (first 50):');
    warnings.slice(0, 50).forEach((issue) => console.log(`- [${issue.id}] ${issue.message}`));
  }

  if (fail) {
    console.error('\nResult: FAIL');
    process.exit(1);
  }

  console.log('\nResult: PASS');
};

main();
