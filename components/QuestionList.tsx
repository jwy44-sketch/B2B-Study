'use client';

import type { Question } from '@/lib/types';

type QuestionListProps = {
  questions: Array<{
    question: Question;
    farPart: number;
    status: 'mastered' | 'unmastered' | 'missed';
    missedCount: number;
  }>;
  onPreview: (question: Question) => void;
};

export function QuestionList({ questions, onPreview }: QuestionListProps) {
  return (
    <div className="space-y-2">
      {questions.map((entry) => (
        <button
          key={entry.question.id}
          onClick={() => onPreview(entry.question)}
          className="card w-full text-left"
        >
          <p className="font-semibold">{entry.question.prompt}</p>
          <p className="mt-1 text-xs text-slate-300">
            FAR Part {entry.farPart} • {entry.status} • Missed {entry.missedCount}x
          </p>
        </button>
      ))}
      {!questions.length && <div className="card text-sm text-slate-300">No questions match these filters.</div>}
    </div>
  );
}
