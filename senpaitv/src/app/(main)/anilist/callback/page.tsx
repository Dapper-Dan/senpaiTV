'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { buildUserKey, storageKey } from '@/lib/aniList/client/userToken';

export default function AniListCallbackPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/token=([^&]+)/);
    
    if (tokenMatch && tokenMatch[1]) {
      const key = buildUserKey(session?.user as any);
      const targetKey = storageKey('anilist_access_token', key);
      localStorage.setItem(targetKey, tokenMatch[1]);
      router.push('/?anilist_connected=true');
    } else {
      router.push('/?anilist_error=No token received');
    }
  }, [router, session?.user]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Connecting to AniList...</p>
      </div>
    </div>
  );
}
