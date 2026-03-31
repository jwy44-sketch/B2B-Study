import { describe, expect, it } from 'vitest';
import { presentQuestion } from '@/lib/presentQuestion';
import type { Question } from '@/lib/types';

describe('presentQuestion', () => {
  it('keeps correct answer text aligned after 100 shuffles', () => {
    const q: Question = {
      id: 'q1',
      stem: 'test',
      prompt: 'test',
      choices: ['A', 'B', 'C', 'D'],
      correctIndex: 2,
      topic: 'Competition',
      session: 'Session 1',
      farRefs: ['FAR 6'],
      explanation: {
        whyCorrect: 'This explanation is intentionally long enough to satisfy minimum length requirements and explain governing concept with FAR reference in a meaningful way.',
        keyTakeaway: 'Use the FAR reference as your anchor and choose compliant documentation-oriented answers on test day.',
        commonTrap: 'Distractors often prioritize speed or convenience over required procedural compliance and documentation details.'
      },
      tags: [],
      source: 'unit'
    };

    for (let i = 0; i < 100; i += 1) {
      const presented = presentQuestion(q, { shuffleChoices: true });
      expect(presented.presentedChoices[presented.presentedCorrectIndex]).toBe('C');
    }
  });
});
