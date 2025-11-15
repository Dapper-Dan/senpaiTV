'use client';

import { Suspense, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAnimeById } from '@/lib/aniList/public/public';
import { updateAniListProgress, setAniListStatus } from '@/app/actions/aniList';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';
import styles from './player.module.css';

function PlayerClient() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get('title') || '';
  const src = params.get('src') || '';
  const animeId = params.get('animeId');
  const aniListId = params.get('aniListId');
  const episodeNumber = params.get('episodeNumber');

  const cachedEpisodes = useMemo(() => {
    if (!animeId || typeof window === 'undefined') return null;
    try {
      const episodesJson = sessionStorage.getItem(`episodes-${animeId}`);
      if (episodesJson) {
        return JSON.parse(episodesJson);
      }
    } catch {
      return;
    }
    return null;
  }, [animeId]);

  const { data: anime } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => getAnimeById(parseInt(animeId || '0')),
    enabled: !!animeId && !cachedEpisodes,
    staleTime: 5 * 60 * 1000,
  });

  const episodes = cachedEpisodes || anime?.streamingEpisodes || [];

  useEffect(() => {
    if (anime?.streamingEpisodes && animeId && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`episodes-${animeId}`, JSON.stringify(anime.streamingEpisodes));
      } catch {
        return;
      }
    }
  }, [anime?.streamingEpisodes, animeId]);

  const currentEpisodeNum = episodeNumber ? parseInt(episodeNumber) : 0;
  const currentEpisodeIndex = currentEpisodeNum - 1;
  const nextEpisodeIndex = currentEpisodeIndex + 1;
  const hasNextEpisode = nextEpisodeIndex < episodes.length;
  const nextEpisode = hasNextEpisode ? episodes[nextEpisodeIndex] : null;

  const handleNextEpisode = async () => {
    if (hasNextEpisode && nextEpisode && animeId) {
      if (currentEpisodeNum > 0 && typeof window !== 'undefined') {
        try {
          const anilistToken = localStorage.getItem('anilist_access_token');
          if (anilistToken && aniListId) {
            await updateAniListProgress(anilistToken, parseInt(aniListId), currentEpisodeNum);
            try { window.dispatchEvent(new Event('anilist-ok')); } catch {}
          }

          try {
            const key = `watched-${aniListId || animeId}`;
            const existing = localStorage.getItem(key);
            const map = existing ? JSON.parse(existing) : {};
            map[String(currentEpisodeNum)] = true;
            localStorage.setItem(key, JSON.stringify(map));
          } catch {
            // ignore
          }
        } catch (error) {
          console.error('Failed to sync AniList progress:', error);
        }
      }

      const nextEpisodeNum = nextEpisodeIndex + 1;
      const nextEpisodeTitle = nextEpisode.title.replace(/^Episode \d+ - /, '');
      const params = new URLSearchParams({
        title: nextEpisodeTitle,
        src: src,
        animeId: animeId,
        aniListId: aniListId || '',
        episodeNumber: nextEpisodeNum.toString(),
      });
      router.replace(`/player?${params.toString()}`);
    }
  };

  const handleEpisodeProgress = async (episodeNum: number) => {
    if (animeId && episodeNum > 0 && typeof window !== 'undefined') {
      try {
        const anilistToken = localStorage.getItem('anilist_access_token');
        if (anilistToken && aniListId) {
          await updateAniListProgress(anilistToken, parseInt(aniListId), episodeNum);
          try { window.dispatchEvent(new Event('anilist-ok')); } catch {}
        }

        try {
          const key = `watched-${aniListId || animeId}`;
          const existing = localStorage.getItem(key);
          const map = existing ? JSON.parse(existing) : {};
          map[String(episodeNum)] = true;
          localStorage.setItem(key, JSON.stringify(map));
        } catch {
          // ignore
        }
      } catch (error) {
        console.error('Failed to sync AniList progress:', error);
        try { window.dispatchEvent(new Event('anilist-error')); } catch {}
      }
    }
  };

  const handleEpisodeStart = async () => {
    try {
      const token = localStorage.getItem('anilist_access_token');
      if (token && aniListId) {
        await setAniListStatus(token, parseInt(aniListId), 'CURRENT');
        try { window.dispatchEvent(new Event('anilist-ok')); } catch {}
      }
    } catch (e) {
      console.log(e);
      try { window.dispatchEvent(new Event('anilist-error')); } catch {}
    }
  };

  if (!src) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No video source provided.</p>
          <button onClick={() => router.back()} className="px-3 py-2 bg-zinc-700 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <VideoPlayer 
        key={title}
        title={title} 
        src={src} 
        onNextEpisode={handleNextEpisode}
        hasNextEpisode={hasNextEpisode}
        animeId={animeId ? parseInt(animeId) : undefined}
        episodeNumber={currentEpisodeNum}
        onProgressSync={handleEpisodeProgress}
        onEpisodeStart={handleEpisodeStart}
      />
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div />}>
      <PlayerClient />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
