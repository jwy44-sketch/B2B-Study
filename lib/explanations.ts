import type { FarRef } from './farReferences';

type BuildExplanationInput = {
  questionText: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  farRef: FarRef;
};

export const buildExplanation = ({ questionText, options, correctIndex, selectedIndex, farRef }: BuildExplanationInput) => {
  const correct = options[correctIndex] ?? 'the correct option';
  const selected = selectedIndex === null ? "I don't know" : options[selectedIndex] ?? "the selected option";
  const distractor = selectedIndex !== null && selectedIndex !== correctIndex
    ? selected
    : options.find((_, idx) => idx !== correctIndex) ?? 'a distractor option';
  const shortQuestion = questionText.length > 160 ? `${questionText.slice(0, 157)}...` : questionText;
  const matchedSelected = selectedIndex !== null && selectedIndex === correctIndex;

  return {
    farLine: `FAR Part ${farRef.part} — ${farRef.title}`,
    linkLabel: `Open FAR Part ${farRef.part} on Acquisition.gov`,
    whyCorrect: `FAR Part ${farRef.part} governs this scenario. The right answer is “${correct}” because it directly aligns with the rule tested in “${shortQuestion}.” This choice reflects the required acquisition policy, not just a convenient operational preference.`,
    wrongBullets: [
      `Common trap: “${distractor}” sounds plausible, but it does not satisfy the controlling FAR requirement for this fact pattern.`,
      matchedSelected
        ? `Other alternatives may be partially true in different contexts, but they are either too broad or apply to different acquisition conditions.`
        : `Your selected answer (“${selected}”) is a frequent distractor because it confuses process convenience with what the FAR actually requires.`
    ],
    keyTakeaway: `Identify the governing FAR Part first, then validate that the chosen option precisely matches that rule before finalizing your answer.`
  };
};
