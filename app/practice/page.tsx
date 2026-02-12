import { Suspense } from 'react';
import PracticeClient from '@/components/PracticeClient';

export default function PracticePage() {
  return (
    <main className="space-y-3">
      <Suspense fallback={<div className="p-4">Loading practice mode…</div>}>
        <PracticeClient />
      </Suspense>
    </main>
  );
}
