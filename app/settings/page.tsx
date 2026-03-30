'use client';

import { loadJson, removeJson, storageKeys } from '@/lib/storage';

export default function SettingsPage() {
  const reset = () => Object.values(storageKeys).forEach((key) => removeJson(key));
  const exportFlags = () => {
    const data = JSON.stringify(loadJson(storageKeys.flagged, []));
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flagged-questions.json';
    a.click();
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Settings</h1>
      <button className="btn" onClick={reset}>Reset my progress</button>
      <button className="btn" onClick={exportFlags}>Export flagged questions JSON</button>
    </div>
  );
}
