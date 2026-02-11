'use client';

import { motion, useReducedMotion } from 'framer-motion';

type LearnProgressProps = {
  batchNumber: number;
  totalBatches: number;
  masteredCount: number;
  batchSize: number;
  progressPct: number;
  modeLabel: string;
  remaining: number;
};

export function LearnProgress({
  batchNumber,
  totalBatches,
  masteredCount,
  batchSize,
  progressPct,
  modeLabel,
  remaining
}: LearnProgressProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mb-3 rounded-lg border border-slate-700 bg-slate-900/90 p-3">
      <div className="mb-1 flex justify-between text-sm">
        <span>Batch {batchNumber} of {totalBatches}</span>
        <span>Mastered {masteredCount}/{batchSize}</span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-slate-700">
        <motion.div
          className="h-full bg-brand"
          animate={{ width: `${progressPct}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
        <span>{modeLabel}</span>
        <span>Remaining: {remaining}</span>
      </div>
    </div>
  );
}
