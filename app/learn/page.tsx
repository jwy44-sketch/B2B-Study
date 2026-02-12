import { Suspense } from 'react';
import LearnClient from '@/components/LearnClient';

export default function LearnPage() {
  return (
    <main className="space-y-3">
      <h1 className="text-2xl font-bold">Learn</h1>
      <Suspense fallback={<div className="p-4">Loading learn mode…</div>}>
        <LearnClient />
      </Suspense>
    </main>
  );
}
