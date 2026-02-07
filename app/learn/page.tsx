'use client';

import LearnClient from '@/components/LearnClient';

export const dynamic = 'force-dynamic';

export default function LearnPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Learn</h1>
      <LearnClient />
    </div>
  );
}
