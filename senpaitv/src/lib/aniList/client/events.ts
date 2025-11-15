'use client';

export function emitAniListOk() {
  try { window.dispatchEvent(new Event('anilist-ok')); } catch {}
}

export function emitAniListError() {
  try { window.dispatchEvent(new Event('anilist-error')); } catch {}
}
