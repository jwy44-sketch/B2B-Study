import type { ScenarioQuestion } from './scenarioQuestionsPart1';
import { scenarioQuestionsPart1 } from './scenarioQuestionsPart1';
import { scenarioQuestionsPart2 } from './scenarioQuestionsPart2';

export { type ScenarioQuestion };

const withSessionSource = (question: ScenarioQuestion): ScenarioQuestion => {
  if (question.sessionSource) return question;
  if (question.questionNumber <= 38) return { ...question, sessionSource: 'Session 1' };
  if (question.questionNumber <= 76) return { ...question, sessionSource: 'Session 2' };
  return { ...question, sessionSource: 'Session 3' };
};

export const scenarioQuestions: ScenarioQuestion[] = [
  ...scenarioQuestionsPart1,
  ...scenarioQuestionsPart2
].map(withSessionSource);

export const scenarioQuestionsSession1 = scenarioQuestions.filter((q) => q.sessionSource === 'Session 1');
export const scenarioQuestionsSession2 = scenarioQuestions.filter((q) => q.sessionSource === 'Session 2');
export const scenarioQuestionsSession3 = scenarioQuestions.filter((q) => q.sessionSource === 'Session 3');
