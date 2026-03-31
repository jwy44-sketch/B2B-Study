import { describe, expect, it } from 'vitest';
import { buildLearnReasoning } from '@/lib/learnReasoning';

describe('buildLearnReasoning', () => {
  it('returns question-specific sections while preserving structure', () => {
    const result = buildLearnReasoning(
      'Who has authority to bind the Government?',
      ['COR', 'Contracting Officer', 'Program Manager', 'Analyst'],
      1,
      {
        whatThisTests: 'x',
        farRefs: { part: { cite: 'FAR', title: 't', url: 'u' }, sections: [] },
        decisionSteps: ['old'],
        whyCorrect: 'old',
        whyWrong: [{ choiceLabel: 'A', reason: 'old' }],
        fieldTip: 'tip'
      }
    );

    expect(result.decisionSteps.length).toBeGreaterThan(1);
    expect(result.whyCorrect).toContain('closest trap');
    expect(result.whyWrong.length).toBe(3);
  });
});
