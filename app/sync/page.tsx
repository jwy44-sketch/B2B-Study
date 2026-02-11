'use client';

import { useState } from 'react';
import { importLearnSession, loadLearnSession } from '@/lib/learnPersistence';

const createKey = () => {
  const source = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return Array.from({ length: 24 }).map(() => source[Math.floor(Math.random() * source.length)]).join('');
};

export default function SyncPage() {
  const [syncKey, setSyncKey] = useState('');
  const [connectedKey, setConnectedKey] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const generate = () => {
    const newKey = createKey();
    setSyncKey(newKey);
    setConnectedKey(newKey);
    setMessage('Sync key generated. Save it securely.');
  };

  const push = async () => {
    const session = loadLearnSession();
    if (!connectedKey || !session) {
      setMessage('Missing connected key or local session.');
      return;
    }

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: connectedKey, session })
    });

    if (!response.ok) {
      setMessage('Push failed.');
      return;
    }

    const now = new Date().toISOString();
    setLastSyncedAt(now);
    setMessage('Progress pushed to sync storage.');
  };

  const pull = async () => {
    if (!connectedKey) {
      setMessage('Enter a sync key first.');
      return;
    }

    const response = await fetch(`/api/sync?key=${encodeURIComponent(connectedKey)}`);
    if (!response.ok) {
      setMessage('No remote session found for that key.');
      return;
    }

    const body = await response.json() as { session: Parameters<typeof importLearnSession>[0]; updatedAt: string };
    const ok = importLearnSession(body.session);
    setLastSyncedAt(body.updatedAt);
    setMessage(ok ? 'Progress pulled and applied locally.' : 'Remote payload invalid.');
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Sync Progress</h1>
      <div className="card space-y-2">
        <button className="btn" onClick={generate}>Generate key</button>
        {syncKey && <p className="text-sm">Generated key: <span className="font-mono">{syncKey}</span></p>}
        <label className="block text-sm">
          Connect key
          <input className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2" value={connectedKey} onChange={(event) => setConnectedKey(event.target.value)} />
        </label>
        <div className="flex gap-2">
          <button className="rounded border border-slate-600 px-3 py-2" onClick={push}>Push</button>
          <button className="rounded border border-slate-600 px-3 py-2" onClick={pull}>Pull</button>
        </div>
        {lastSyncedAt && <p className="text-xs text-slate-300">Last synced: {lastSyncedAt}</p>}
        {message && <p className="text-sm text-sky-300">{message}</p>}
      </div>
    </div>
  );
}
