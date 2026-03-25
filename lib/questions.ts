import rawQuestions from '@/data/con3910_quizlet.json';
import { inferFarRef } from './farReferences';
import type { ExplanationRich, Question } from './types';
import { guidanceForPart } from './rfoTopicGuidance';

type RawQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  source: string;
  explanation?: string;
  explanationRich?: ExplanationRich;
};

function validateRawQuestions(items: RawQuestion[]): void {
  if (items.length !== 180) {
    throw new Error(`Invalid question dataset size: expected 180, got ${items.length}`);
  }

  const seen = new Set<string>();
  items.forEach((item, idx) => {
    if (seen.has(item.id)) throw new Error(`Duplicate question id detected: ${item.id}`);
    seen.add(item.id);
    if (!Array.isArray(item.choices) || item.choices.length !== 4) {
      throw new Error(`Question ${item.id || idx} must have exactly 4 choices`);
    }
    if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex > 3) {
      throw new Error(`Question ${item.id || idx} has invalid correctIndex ${item.correctIndex}`);
    }

    if (!item.explanationRich || !item.explanation || !item.explanation.trim()) {
      throw new Error(`Question ${item.id} is missing embedded explanation content`);
    }
  });
}

const toQuestion = (item: RawQuestion): Question => {
  const farRef = inferFarRef(item.question);
  const correct = item.choices[item.correctIndex];
  const topicGuidance = guidanceForPart(farRef.part);
  const baseExplanationRich = item.explanationRich as ExplanationRich;
  const explanationRich: ExplanationRich = {
    ...baseExplanationRich,
    rfoStatus: topicGuidance?.rfoStatus ?? baseExplanationRich.rfoStatus,
    rfoTransitionNote: topicGuidance?.rfoTransitionNote ?? baseExplanationRich.rfoTransitionNote,
    rfoCitations: topicGuidance?.citations ?? baseExplanationRich.rfoCitations
  };

  return {
    id: item.id,
    prompt: item.question,
    choices: item.choices,
    correctIndex: item.correctIndex,
    topic: `FAR Part ${farRef.part}`,
    session: 'General',
    farRefs: [item.explanationRich?.farRefs.part.cite ?? `FAR Part ${farRef.part}`],
    explanationText: item.explanation,
    explanationRich,
    explanation: {
      whyCorrect: item.explanationRich?.whyCorrect ?? `The correct answer is ${correct}.`,
      keyTakeaway: item.explanationRich?.fieldTip ?? `Anchor this topic to FAR Part ${farRef.part}.`,
      commonTrap: item.explanationRich?.whyWrong?.[0]?.reason ?? 'Compare each option to the rule language before selecting.'
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
