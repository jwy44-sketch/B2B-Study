import type { ScenarioQuestion } from './scenarioTypes';

export async function loadScenarioQuestions(): Promise<ScenarioQuestion[]> {
  const res = await fetch('/scenario-questions.json');
  if (!res.ok) throw new Error('Failed loading scenario questions');
  const data = (await res.json()) as ScenarioQuestion[];
  return data;
}
