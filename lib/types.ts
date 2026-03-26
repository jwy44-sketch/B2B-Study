export type Question = {
  id: string;
  stem: string;
  prompt?: string;
  choices: [string, string, string, string];
  correctIndex: number;
  topic: string;
  session: string;
  farRefs: string[];
  explanationRich?: {
    farRefs: {
      part: { cite: string; title: string; url: string };
      sections: { cite: string; title: string }[];
    };
    whatThisTests: string;
    decisionSteps: string[];
    whyCorrect: string;
    whyWrong: { choiceLabel: string; reason: string }[];
    fieldTip: string;
  };
  explanation: {
    whyCorrect: string;
    keyTakeaway: string;
    commonTrap: string;
  };
  tags: string[];
  source: string;
};

export type PresentedQuestion = {
  question: Question;
  presentedChoices: string[];
  presentedCorrectIndex: number;
  mapping: number[];
};
