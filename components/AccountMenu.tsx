'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function AccountMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div className="text-sm text-slate-400">Checking account…</div>;
  if (!user) {
    return (
      <div className="flex gap-2 text-sm">
        <Link className="rounded border border-slate-600 px-3 py-1" href="/auth">Log in</Link>
        <Link className="rounded border border-slate-600 px-3 py-1" href="/auth">Create account</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-300">{user.email}</span>
      <button className="rounded border border-slate-600 px-3 py-1" onClick={() => signOut()}>Log out</button>
    </div>
  );
}
