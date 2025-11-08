'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AniListCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/token=([^&]+)/);
    
    if (tokenMatch && tokenMatch[1]) {
      localStorage.setItem('anilist_access_token', tokenMatch[1]);
      router.push('/?anilist_connected=true');
    } else {
      router.push('/?anilist_error=No token received');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Connecting to AniList...</p>
      </div>
    </div>
  );
}
