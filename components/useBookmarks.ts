'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson, storageKeys } from '@/lib/storage';

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(loadJson<string[]>(storageKeys.bookmarks, []));
  }, []);

  useEffect(() => {
    saveJson(storageKeys.bookmarks, ids);
  }, [ids]);

  const lookup = useMemo(() => new Set(ids), [ids]);
  const toggle = (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return { ids, lookup, toggle };
}
