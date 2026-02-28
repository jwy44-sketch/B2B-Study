import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Question = {
  id?: string;
  question?: string;
  choices?: string[];
  correctIndex?: number;
  explanation?: string;
  explanationRich?: {
    decisionSteps?: string[];
    whyCorrect?: string;
    whyWrong?: Array<{ choiceLabel: string; reason: string }>;
    fieldTip?: string;
    farRefs?: { part?: { url?: string } };
  };
};

function isValidFarPartUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.startsWith('https://www.acquisition.gov/far/part-')) return true;
  if (url.startsWith('https://www.acquisition.gov/dfars')) return true;
  return false;
}

function fail(message: string): never {
  console.error(`\n❌ ${message}`);
  process.exit(1);
}

function main() {
  const bankPath = join(process.cwd(), 'data', 'con3910_quizlet.json');
  const questions = JSON.parse(readFileSync(bankPath, 'utf8')) as Question[];
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const q of questions) {
    const id = q.id ?? '(missing-id)';
    if (!q.id) errors.push('Missing id');
    if (q.id && seen.has(q.id)) errors.push(`${id}: duplicate id`);
    if (q.id) seen.add(q.id);
    if (!q.question || q.question.length < 10) errors.push(`${id}: question text is too short`);
    if (!Array.isArray(q.choices) || q.choices.length < 2) errors.push(`${id}: choices missing`);
    if (!Number.isInteger(q.correctIndex) || (q.correctIndex ?? -1) < 0 || (q.correctIndex ?? -1) >= (q.choices?.length ?? 0)) {
      errors.push(`${id}: invalid correctIndex`);
    }
    if (!q.explanationRich) errors.push(`${id}: missing explanationRich`);
    if (!q.explanation || q.explanation.length < 120) errors.push(`${id}: missing explanation text`);

    const rich = q.explanationRich;
    if (rich) {
      if (!Array.isArray(rich.decisionSteps) || rich.decisionSteps.length < 3) errors.push(`${id}: decisionSteps must be at least 3`);
      if (!Array.isArray(rich.whyWrong) || rich.whyWrong.length < 2) errors.push(`${id}: whyWrong must be at least 2`);
      if (!rich.whyCorrect || rich.whyCorrect.length < 100) errors.push(`${id}: whyCorrect must be at least 100 chars`);
      if (!rich.fieldTip || rich.fieldTip.length < 30) errors.push(`${id}: fieldTip must be at least 30 chars`);
      if (!isValidFarPartUrl(rich.farRefs?.part?.url)) errors.push(`${id}: farRefs.part.url invalid or missing`);
    }
  }

  if (errors.length) {
    console.error(`Checked ${questions.length} questions. Found ${errors.length} validation error(s):`);
    for (const error of errors.slice(0, 200)) console.error(` - ${error}`);
    fail('Explanation quality checks failed.');
  }

  console.log(`✅ Explanation checks passed for ${questions.length} questions.`);
}

main();
