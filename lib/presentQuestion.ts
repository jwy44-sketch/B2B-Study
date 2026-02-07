import { PresentedQuestion, Question } from './types';

const explanationFallback = (q: Question) => ({
  whyCorrect: `This item tests ${q.topic} in ${q.session}. The best response aligns with ${q.farRefs[0] ?? 'governing FAR guidance'} and the acquisition objective in the prompt, not just a memorized phrase.`,
  keyTakeaway: `When unsure, identify the governing FAR part (${q.farRefs.join(', ') || 'relevant FAR'}) and choose the option that preserves competition, documentation, and mission support.`,
  commonTrap: `A distractor often sounds procedural but skips a required condition from ${q.farRefs[0] ?? 'the FAR'}; avoid choices that look convenient but noncompliant.`
});

export function ensureExplanation(q: Question): Question {
  const merged = { ...q, explanation: { ...explanationFallback(q), ...(q.explanation || {}) } };
  const joined = `${merged.explanation.whyCorrect}${merged.explanation.keyTakeaway}${merged.explanation.commonTrap}`;
  if (joined.length < 180) {
    merged.explanation = explanationFallback(q);
  }
  return merged;
}

export function presentQuestion(question: Question, options?: { shuffleChoices?: boolean }): PresentedQuestion {
  const safe = ensureExplanation(question);
  const presentedChoices = [...safe.choices];
  const mapping = [0, 1, 2, 3];

  if (options?.shuffleChoices) {
    for (let i = presentedChoices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [presentedChoices[i], presentedChoices[j]] = [presentedChoices[j], presentedChoices[i]];
      [mapping[i], mapping[j]] = [mapping[j], mapping[i]];
    }
  }

  return {
    question: safe,
    presentedChoices,
    presentedCorrectIndex: mapping.findIndex((originalIdx) => originalIdx === safe.correctIndex),
    mapping
  };
}
