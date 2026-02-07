import rawQuestions from '@/data/con3910_quizlet.json';
import { Question } from './types';

type RawQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  source: string;
};

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
  return (rawQuestions as RawQuestion[]).map(toQuestion);
}
