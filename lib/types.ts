export type Question = {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: number;
  topic: string;
  session: string;
  farRefs: string[];
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
