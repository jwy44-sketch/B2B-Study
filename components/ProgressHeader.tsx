'use client';

import { motion } from 'framer-motion';

export function ProgressHeader({ current, total, streak }: { current: number; total: number; streak: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="sticky top-14 z-30 mb-3 rounded-lg border border-slate-700 bg-slate-900/90 p-3">
      <div className="mb-1 flex justify-between text-sm">
        <span>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span>Streak: {streak}</span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-slate-700">
        <motion.div className="h-full bg-brand" animate={{ width: `${pct}%` }} transition={{ duration: 0.25 }} />
      </div>
    </div>
  );
}
