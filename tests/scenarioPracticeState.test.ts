import { describe, expect, it } from 'vitest';
import {
  findNextUnansweredIndex,
  normalizeSavedScenarioPracticeProgress,
  selectScenarioPracticeChunkQuestions,
  type ScenarioPracticeProgress
} from '@/lib/scenarioPracticeState';
import type { ScenarioQuestion } from '@/lib/scenarioTypes';

const questions: ScenarioQuestion[] = [
  {
    id: 'q1',
    stem: 'Q1',
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
      { id: 'd', text: 'D' }
    ],
    correctChoiceId: 'a',
    explanation: 'ex',
    topic: 't',
    sessionSource: 's'
  },
  {
    id: 'q2',
    stem: 'Q2',
    choices: [
      { id: 'a2', text: 'A2' },
      { id: 'b2', text: 'B2' },
      { id: 'c2', text: 'C2' },
      { id: 'd2', text: 'D2' }
    ],
    correctChoiceId: 'a2',
    explanation: 'ex2',
    topic: 't',
    sessionSource: 's'
  }
];

describe('scenario practice state', () => {
  it('normalizes stale index to first unanswered question', () => {
    const saved: ScenarioPracticeProgress = {
      sessionId: 's1',
      questionOrder: ['q1', 'q2'],
      choiceOrderByQuestion: { q1: ['a', 'b', 'c', 'd'], q2: ['a2', 'b2', 'c2', 'd2'] },
      currentIndex: 0,
      answers: { q1: { selectedChoiceId: 'a', isCorrect: true } },
      completed: false
    };

    const normalized = normalizeSavedScenarioPracticeProgress(saved, questions);
    expect(normalized.currentIndex).toBe(1);
    expect(normalized.completed).toBe(false);
  });



  it('selects the fixed Q031-Q060/SCN-031-SCN-060 chunk order', () => {
    const mixed = [
      { ...questions[1], id: 'SCN-060' },
      { ...questions[0], id: 'Q031' },
      { ...questions[1], id: 'SCN-031' },
      { ...questions[0], id: 'Q060' }
    ];

    const selected = selectScenarioPracticeChunkQuestions(mixed);
    expect(selected.map((q) => q.id)).toEqual(['Q031', 'Q060']);
  });

  it('finds next unanswered and returns -1 when all answered', () => {
    const progress: ScenarioPracticeProgress = {
      sessionId: 's2',
      questionOrder: ['q1', 'q2'],
      choiceOrderByQuestion: { q1: ['a', 'b', 'c', 'd'], q2: ['a2', 'b2', 'c2', 'd2'] },
      currentIndex: 0,
      answers: { q1: { selectedChoiceId: 'a', isCorrect: true } },
      completed: false
    };

    expect(findNextUnansweredIndex(progress, 0)).toBe(1);
    expect(findNextUnansweredIndex({ ...progress, answers: { q1: { selectedChoiceId: 'a', isCorrect: true }, q2: { selectedChoiceId: 'a2', isCorrect: true } } }, 0)).toBe(-1);
  });
});
