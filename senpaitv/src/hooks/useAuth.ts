'use client';
import { useSession, signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    isGuest: !session,
    signIn: () => {
      try { window.dispatchEvent(new CustomEvent('auth-pending', { detail: 'signin' })); } catch {}
      return nextSignIn();
    },
    signOut: () => {
      try { window.dispatchEvent(new CustomEvent('auth-pending', { detail: 'signout' })); } catch {}
      return nextSignOut();
    },
  };
}
