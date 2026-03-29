'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  getCurrentUser,
  hasSupabaseConfig,
  resetPasswordForEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  syncUserStateFromCloudToLocal
} from '@/lib/supabase';
import { buildScopedKey } from '@/lib/storage';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const configured = hasSupabaseConfig();

  const refreshUser = async () => {
    const user = await getCurrentUser();
    setUserEmail(user?.email ?? null);
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const handle = async (fn: () => Promise<void>, okMessage: string) => {
    setLoading(true);
    setMessage('');
    try {
      await fn();
      await syncUserStateFromCloudToLocal(buildScopedKey);
      await refreshUser();
      setMessage(okMessage);
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Unexpected error';
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = (e: FormEvent) => {
    e.preventDefault();
    void handle(() => signInWithPassword(email, password), 'Logged in successfully.');
  };

  const submitSignup = () => {
    void handle(() => signUpWithPassword(email, password), 'Account created. Check email if confirmation is enabled.');
  };

  const submitReset = () => {
    void handle(() => resetPasswordForEmail(email), 'Password reset email requested.');
  };

  const submitLogout = () => {
    void handle(() => signOut(), 'Logged out.');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Account & Security</h1>
      {!configured ? (
        <div className="card text-sm text-amber-300">
          Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </div>
      ) : null}

      <div className="card space-y-3">
        <p className="text-sm text-slate-300">Status: {userEmail ? `Signed in as ${userEmail}` : 'Signed out'}</p>
        <form className="grid gap-2" onSubmit={submitLogin}>
          <input className="rounded border border-slate-700 bg-slate-800 p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="rounded border border-slate-700 bg-slate-800 p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="flex flex-wrap gap-2">
            <button className="btn" type="submit" disabled={loading || !configured}>Log in</button>
            <button className="btn" type="button" onClick={submitSignup} disabled={loading || !configured}>Sign up</button>
            <button className="btn" type="button" onClick={submitReset} disabled={loading || !configured || !email}>Forgot password</button>
            <button className="btn" type="button" onClick={submitLogout} disabled={loading || !configured || !userEmail}>Log out</button>
          </div>
        </form>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>

      <div className="card space-y-2 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">MFA</h2>
        <p>MFA can be enabled using Supabase Auth factors (TOTP/WebAuthn). This page provides a secure path and can be expanded with enrollment UI next.</p>
        <p>Current safe default: password auth via managed Supabase Auth, with room to enforce MFA policy without changing study content.</p>
      </div>
    </div>
  );
}
