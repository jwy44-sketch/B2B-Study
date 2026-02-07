import rawQuestions from '@/data/con3910_quizlet.json';
import { Question } from './types';

type RawQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  source: string;
};

function validateRawQuestions(items: RawQuestion[]): void {
  if (items.length !== 150) {
    throw new Error(`Invalid question dataset size: expected 150, got ${items.length}`);
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

const toQuestion = (item: RawQuestion): Question => ({
  id: item.id,
  prompt: item.question,
  choices: item.choices,
  correctIndex: item.correctIndex,
  topic: 'General',
  session: 'General',
  farRefs: ['FAR'],
  explanation: {
    whyCorrect: '',
    keyTakeaway: '',
    commonTrap: ''
  },
  tags: ['con3910', 'quizlet'],
  source: item.source
});

export async function loadQuestions(): Promise<Question[]> {
  const typed = rawQuestions as RawQuestion[];
  validateRawQuestions(typed);
  return typed.map(toQuestion);
}
