import Link from 'next/link';

type LearnCompleteCardProps = {
  title: string;
  subtitle: string;
  totalQuestions: number;
  totalBatches: number;
  masteredCount: number;
  correctCount: number;
  incorrectCount: number;
  missedCount: number;
  onRestart: () => void;
  onStartShuffled: () => void;
  onReviewMissed?: () => void;
};

export function LearnCompleteCard({
  title,
  subtitle,
  totalQuestions,
  totalBatches,
  masteredCount,
  correctCount,
  incorrectCount,
  missedCount,
  onRestart,
  onStartShuffled,
  onReviewMissed
}: LearnCompleteCardProps) {
  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-slate-300">{subtitle}</p>
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <p>Total questions: {totalQuestions}</p>
        <p>Batches completed: {totalBatches}</p>
        <p>Mastered: {masteredCount}/{totalQuestions}</p>
        <p>Correct / Incorrect: {correctCount} / {incorrectCount}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn" onClick={onRestart}>Restart Learn</button>
        <button className="rounded border border-brand px-3 py-2 text-brand" onClick={onStartShuffled}>Start New Shuffled Session</button>
        {missedCount > 0 && onReviewMissed && (
          <button className="rounded border border-amber-500 px-3 py-2 text-amber-300" onClick={onReviewMissed}>Review Missed Questions</button>
        )}
        <Link className="rounded border border-slate-600 px-3 py-2" href="/">Return to Study Home</Link>
      </div>
    </div>
  );
}
