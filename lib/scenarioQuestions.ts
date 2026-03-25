import type { ScenarioQuestion } from './scenarioQuestionsPart1';
import { scenarioQuestionsPart1 } from './scenarioQuestionsPart1';
import { scenarioQuestionsPart2 } from './scenarioQuestionsPart2';

export { type ScenarioQuestion };

export const scenarioQuestions: ScenarioQuestion[] = [
  ...scenarioQuestionsPart1,
  ...scenarioQuestionsPart2
];
