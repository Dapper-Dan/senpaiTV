'use client';

import { useSession } from 'next-auth/react';
import { buildUserKey, getTokenForUser } from './userToken';

export function useAniListToken() {
  const { data: session } = useSession();
  const userKey = buildUserKey(session?.user as any);
  const token = typeof window !== 'undefined' ? getTokenForUser(userKey) : null;
  return {
    token,
    userKey,
    isConnected: !!token,
  };
}
