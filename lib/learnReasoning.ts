import type { Question } from './types';

type ExplanationRich = NonNullable<Question['explanationRich']>;

function topicHint(stem: string): string {
  const s = stem.toLowerCase();
  if (s.includes('who') || s.includes('authority')) return 'who has actual contractual authority';
  if (s.includes('when') || s.includes('phase') || s.includes('before') || s.includes('after')) return 'the acquisition phase and timing';
  if (s.includes('form') || s.includes('section') || s.includes('ucf')) return 'the correct document or section for the action';
  if (s.includes('terminate') || s.includes('change') || s.includes('modification')) return 'the proper post-award contract action';
  return 'the specific FAR-driven decision point in the stem';
}

function shortChoice(choice: string): string {
  return choice.length > 72 ? `${choice.slice(0, 69)}...` : choice;
}

export function buildLearnReasoning(
  stem: string,
  choices: string[],
  presentedCorrectIndex: number,
  explanationRich: ExplanationRich
): Pick<ExplanationRich, 'decisionSteps' | 'whyCorrect' | 'whyWrong'> {
  const correct = choices[presentedCorrectIndex] ?? '';
  const wrong = choices
    .map((text, idx) => ({ text, idx }))
    .filter((c) => c.idx !== presentedCorrectIndex);

  const decisionSteps = [
    `Start by identifying ${topicHint(stem)} in this scenario, not just the most familiar FAR term.`,
    `Use the stem facts to test each option against the exact action being asked for, then eliminate options that belong to a different role, phase, or instrument.`,
    `Confirm the best answer is the only option that directly satisfies the question as written: “${shortChoice(correct)}”.`
  ];

  const closestTrap = wrong[0]?.text;
  const whyCorrect = closestTrap
    ? `This answer is correct because it directly matches the decision the stem asks you to make. The closest trap is “${shortChoice(closestTrap)},” which sounds plausible but does not satisfy the specific requirement in the prompt as precisely as the correct option does.`
    : explanationRich.whyCorrect;

  const whyWrong = wrong.map((item, i) => ({
    choiceLabel: String.fromCharCode(65 + i),
    reason: `This option is tempting because “${shortChoice(item.text)}” sounds related. It is wrong here because the stem’s required decision is better met by “${shortChoice(correct)},” not this alternative.`
  }));

  return { decisionSteps, whyCorrect, whyWrong };
}
