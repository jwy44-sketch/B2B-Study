import { inferFarDetail, type FarRef } from './farReferences';

type BuildExplanationInput = {
  questionId?: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  farRef: FarRef;
};

export const buildExplanation = ({ questionId, questionText, options, correctIndex, selectedIndex, farRef }: BuildExplanationInput) => {
  const correct = options[correctIndex] ?? 'the correct option';
  const selected = selectedIndex === null ? "I don't know" : options[selectedIndex] ?? 'the selected option';
  const distractor = selectedIndex !== null && selectedIndex !== correctIndex
    ? selected
    : options.find((_, idx) => idx !== correctIndex) ?? 'a distractor option';

  const detail = inferFarDetail(questionId ?? '', questionText);

  return {
    farLine: `FAR Part ${farRef.part} — ${farRef.title}`,
    linkLabel: `Open FAR Part ${farRef.part} on Acquisition.gov`,
    references: {
      part: detail.part,
      subpart: detail.subpart,
      sections: detail.sections
    },
    whyCorrect: `“${correct}” is correct because it matches the controlling FAR rule for this scenario and keeps the action compliant with the proper acquisition procedure.`,
    wrongBullets: [
      `Common trap: “${distractor}” may feel expedient, but it conflicts with the cited FAR authority for this fact pattern.`,
      `Another trap is focusing on speed/convenience instead of the documented competition, modification, or negotiation requirement.`
    ],
    keyTakeaway: `Use the governing FAR Part first, then apply the cited Subpart/Section requirement before selecting an answer.`
  };
};
