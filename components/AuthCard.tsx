'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function AuthCard() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setSuccess('Account created and signed in.');
      } else {
        await signIn(email, password);
        setSuccess('Signed in successfully.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed');
    }
  };

  return (
    <div className="card space-y-3 max-w-md">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="flex gap-2">
        <button className={`rounded border px-3 py-1 ${mode === 'signin' ? 'border-brand text-brand' : 'border-slate-600'}`} onClick={() => setMode('signin')}>Sign In</button>
        <button className={`rounded border px-3 py-1 ${mode === 'signup' ? 'border-brand text-brand' : 'border-slate-600'}`} onClick={() => setMode('signup')}>Create Account</button>
      </div>
      <label className="text-sm">Email
        <input className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="text-sm">Password
        <input type="password" className="mt-1 w-full rounded border border-slate-700 bg-slate-800 p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {success && <p className="text-sm text-green-300">{success}</p>}
      <button className="btn" onClick={submit}>{mode === 'signup' ? 'Create account' : 'Sign in'}</button>
    </div>
  );
}
