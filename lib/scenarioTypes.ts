export type ScenarioChoice = {
  id: string;
  text: string;
};

export type ScenarioQuestion = {
  id: string;
  questionNumber: number;
  sessionSource: 'Session 1' | 'Session 2' | 'Session 3' | 'Session 4';
  topic: string;
  stem: string;
  choices: ScenarioChoice[];
  correctChoiceId: string;
  explanation: string;
  sourceSet: 'con3990v-scenario-bank-full';
  difficulty?: 'easy' | 'medium' | 'hard';
};
