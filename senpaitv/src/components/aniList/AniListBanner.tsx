'use client';

import { useEffect, useState } from 'react';

export default function AniListBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onErr() {
      setVisible(true);
    }
    function onOk() {
      setVisible(false);
    }
    window.addEventListener('anilist-error', onErr);
    window.addEventListener('anilist-ok', onOk);
    return () => {
      window.removeEventListener('anilist-error', onErr);
      window.removeEventListener('anilist-ok', onOk);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-700 text-white text-sm">
      <div className="mx-auto max-w-screen-2xl px-4 py-2 flex items-center justify-center gap-2">
        <span className="opacity-80">The AniList API appears to be experiencing issues. Some features may be temporarily unavailable.</span>
      </div>
    </div>
  );
}
