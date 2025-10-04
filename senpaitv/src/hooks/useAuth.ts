'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    isGuest: !session,
    signIn: () => signIn(),
    signOut: () => signOut(),
  };
}
