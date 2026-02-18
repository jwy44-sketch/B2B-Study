export type Question = {
  id: string;
  prompt: string;
  scenarioContext?: string | null;
  choices: [string, string, string, string];
  correctIndex: number;
  topic: string;
  session: string;
  farRefs: string[];
  explanationText?: string;
  explanationRich?: ExplanationRich;
  explanation: {
    whyCorrect: string;
    keyTakeaway: string;
    commonTrap: string;
  };
  tags: string[];
  source: string;
};

export type ExplanationRich = {
  farRefs: {
    part: { cite: string; title: string; url: string };
    subpart?: { cite: string; title: string; url: string };
    sections: Array<{ cite: string; title: string; url: string }>;
  };
  whatThisTests: string;
  decisionSteps: string[];
  whyCorrect: string;
  whyWrong: Array<{ choiceLabel: string; reason: string }>;
  fieldTip: string;
  memoryHook?: string;
};

export type PresentedQuestion = {
  question: Question;
  presentedChoices: string[];
  presentedCorrectIndex: number;
  mapping: number[];
};
