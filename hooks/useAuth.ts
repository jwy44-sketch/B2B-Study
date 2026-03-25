'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, signIn, signOut, signUp, type AuthUser } from '@/lib/authClient';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
    signUp: async (email: string, password: string) => {
      const next = await signUp(email, password);
      setUser(next);
      return next;
    },
    signIn: async (email: string, password: string) => {
      const next = await signIn(email, password);
      setUser(next);
      return next;
    },
    signOut: async () => {
      await signOut();
      setUser(null);
    }
  };
}
