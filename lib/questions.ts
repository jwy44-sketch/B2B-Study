import rawQuestions from '@/data/con3910_quizlet.json';
import { inferFarRef } from './farReferences';
import { Question } from './types';

type RawQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  source: string;
};

function validateRawQuestions(items: RawQuestion[]): void {
  if (items.length !== 180) {
    throw new Error(`Invalid question dataset size: expected 180, got ${items.length}`);
  }

  const seen = new Set<string>();
  items.forEach((item, idx) => {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate question id detected: ${item.id}`);
    }
    seen.add(item.id);

    if (!Array.isArray(item.choices) || item.choices.length !== 4) {
      throw new Error(`Question ${item.id || idx} must have exactly 4 choices`);
    }

    if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex > 3) {
      throw new Error(`Question ${item.id || idx} has invalid correctIndex ${item.correctIndex}`);
    }

    if (!item.choices[item.correctIndex]) {
      throw new Error(`Question ${item.id || idx} correctIndex does not map to a valid choice`);
    }
  });
}

const toQuestion = (item: RawQuestion): Question => {
  const farRef = inferFarRef(item.question);
  const correct = item.choices[item.correctIndex];
  const distractor = item.choices.find((_, idx) => idx !== item.correctIndex) ?? item.choices[0];

  return {
    id: item.id,
    prompt: item.question,
    choices: item.choices,
    correctIndex: item.correctIndex,
    topic: `FAR Part ${farRef.part}`,
    session: 'General',
    farRefs: [`FAR Part ${farRef.part}`],
    explanation: {
      whyCorrect: `FAR reference: FAR Part ${farRef.part} — ${farRef.title}. Link: ${farRef.url}. Why this is correct: “${correct}” aligns with the governing rule in this scenario and preserves compliance with required acquisition procedure.`,
      keyTakeaway: `Key takeaway: Start with FAR Part ${farRef.part} and select the answer that directly matches the rule text and intent.`,
      commonTrap: `Why a common distractor is wrong: “${distractor}” may sound practical, but it does not satisfy the FAR requirement for this fact pattern.`
    },
    tags: ['con3910', 'quizlet', `FAR-${farRef.part}`],
    source: item.source
  };
};

export async function loadQuestions(): Promise<Question[]> {
  const typed = rawQuestions as RawQuestion[];
  validateRawQuestions(typed);
  return typed.map(toQuestion);
}
