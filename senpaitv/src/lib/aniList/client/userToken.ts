'use client';

export function buildUserKey(user?: { id?: string | null; email?: string | null }) {
  return (user?.id || user?.email || '').toString();
}

export function storageKey(base: string, userKey?: string) {
  return userKey ? `${base}:${userKey}` : base;
}

export function getTokenForUser(userKey: string) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(storageKey('anilist_access_token', userKey));
}

export function clearTokensForUser(userKey: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('anilist_access_token');
    localStorage.removeItem('anilist_token_data');
    if (userKey) {
      localStorage.removeItem(storageKey('anilist_access_token', userKey));
      localStorage.removeItem(storageKey('anilist_token_data', userKey));
    }
  } catch {}
}
