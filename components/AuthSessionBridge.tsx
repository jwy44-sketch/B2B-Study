'use client';

import { useEffect } from 'react';
import { buildScopedKey } from '@/lib/storage';
import { hasSupabaseConfig, syncUserStateFromCloudToLocal } from '@/lib/supabase';

export default function AuthSessionBridge() {
  useEffect(() => {
    if (!hasSupabaseConfig()) return;
    void syncUserStateFromCloudToLocal(buildScopedKey).catch(() => undefined);
  }, []);

  return null;
}
