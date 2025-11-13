'use client';

import { useEffect, useRef, useState } from 'react';
import { gql, GraphQLClient } from 'graphql-request';
import { setAniListScore } from '@/app/actions/aniList';

async function fetchAniListScore(accessToken: string, mediaId: number): Promise<number | null> {
  const endpoint = 'https://graphql.anilist.co';
  const client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const query = gql`
    query MediaListEntryScore($mediaId: Int!) {
      Media(id: $mediaId, type: ANIME) {
        id
        mediaListEntry {
          score
        }
      }
    }
  `;
  try {
    const res = await client.request<any>(query, { mediaId });
    const score = res?.Media?.mediaListEntry?.score as number | undefined;
    return typeof score === 'number' ? score : null;
  } catch {
    return null;
  }
}

export default function ScoreInput({ aniListId }: { aniListId: number }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function openAndPrefill() {
    setOpen((v) => !v);
    if (open) return;
    const token = localStorage.getItem('anilist_access_token');
    if (!token) return;
    const current = await fetchAniListScore(token, aniListId);
    if (current !== null) setValue(String(current));
  }

  async function submit() {
    setError(null);
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 10) {
      setError('Enter a score 0–10');
      return;
    }
    const token = localStorage.getItem('anilist_access_token');
    if (!token) {
      setError('Connect AniList first');
      return;
    }
    try {
      setLoading(true);
      await setAniListScore(token, aniListId, n);
      setOpen(false);
    } catch (e: any) {
      setError('Failed to submit score');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex" ref={ref}>
      <button onClick={openAndPrefill} aria-label="Submit score">
        <img src={"/images/icons/add.svg"} className="cursor-pointer" alt="submit score" width={25} height={25} />
      </button>
      {open && (
        <div className="absolute mt-7 rounded border border-[#fefefe] bg-black/75 p-3 min-w-[180px] backdrop-blur-sm">
          <div className="mb-2 text-sm font-semibold text-[#fefefe]">Your score (0–10)</div>
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded border border-[#171717] p-1 text-[#171717] bg-white"
          />
          {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
          <div className="mt-2 flex gap-2">
            <button onClick={submit} disabled={loading} className="px-2 py-1 rounded bg-[#171717] text-sm border border-[#fefefe]">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setOpen(false)} className="px-2 py-1 rounded border border-[#171717] bg-[#fefefe] text-[#171717] text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
