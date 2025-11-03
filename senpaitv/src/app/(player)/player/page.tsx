'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAnimeById } from '@/lib/aniList/public/public';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';
import styles from './player.module.css';

export default function PlayerPage() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get('title') || '';
  const src = params.get('src') || '';
  const animeId = params.get('animeId');
  const episodeNumber = params.get('episodeNumber');

  const { data: anime } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => getAnimeById(parseInt(animeId || '0')),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000,
  });

  const episodes = anime?.streamingEpisodes || [];
  const currentEpisodeIndex = episodeNumber ? parseInt(episodeNumber) - 1 : -1; // Convert 1-based to 0-based
  const nextEpisodeIndex = currentEpisodeIndex + 1;
  const hasNextEpisode = nextEpisodeIndex < episodes.length;
  const nextEpisode = hasNextEpisode ? episodes[nextEpisodeIndex] : null;

  const handleNextEpisode = () => {
    if (hasNextEpisode && nextEpisode && animeId) {
      const nextEpisodeTitle = nextEpisode.title.replace(/^Episode \d+ - /, '');
      const params = new URLSearchParams({
        title: nextEpisodeTitle,
        src: src,
        animeId: animeId,
        episodeNumber: (nextEpisodeIndex + 1).toString(),
      });
      router.push(`/player?${params.toString()}`);
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
      />
    </div>
  );
}
