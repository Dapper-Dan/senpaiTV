'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { syncAniListWithWatchlist } from '@/app/actions/aniList';

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const LAST_SYNC_KEY = 'anilist_watchlist_last_sync';

export default function AutoSyncWatchlist() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('anilist_access_token') : null;
    if (!token) return;

    try {
      const lastSync = localStorage.getItem(LAST_SYNC_KEY);
      const lastSyncMs = lastSync ? parseInt(lastSync, 10) : 0;
      const now = Date.now();

      if (!lastSyncMs || now - lastSyncMs > TWELVE_HOURS_MS) {
        syncAniListWithWatchlist(token)
          .then(() => {
            localStorage.setItem(LAST_SYNC_KEY, String(now));
            router.refresh();
            try { window.dispatchEvent(new Event('anilist-ok')); } catch {}
          })
          .catch(() => {
            try { window.dispatchEvent(new Event('anilist-error')); } catch {}
          });
      }
    } catch {
      // ignore
    }
  }, [router]);

  return null;
}
