'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getEpisodeDetails } from '@/lib/mal/public/public';

interface EpisodeDetails {
  synopsis: string;
  duration: number;
  aired: string;
}

interface UseEpisodeDescriptionReturn {
  episodeDetails: Map<number, EpisodeDetails>;
  loadingEpisodes: Set<number>;
  loadedCount: number;
  episodeRef: (node: HTMLDivElement | null, episodeIndex: number) => void;
}

const INITIAL_LOAD_COUNT = 3;
const INTERSECTION_THRESHOLD = 0.1;
const ROOT_MARGIN = '50px';

export function useEpisodeDescription(episodes: any[], animeId: number): UseEpisodeDescriptionReturn {
  const [episodeDetails, setEpisodeDetails] = useState<Map<number, EpisodeDetails>>(new Map());
  const [loadingEpisodes, setLoadingEpisodes] = useState<Set<number>>(new Set());
  const [loadedCount, setLoadedCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const queryClient = useQueryClient();

  const loadEpisodeDetails = useCallback(async (episodeIndex: number): Promise<void> => {
    if (episodeDetails.has(episodeIndex) || loadingEpisodes.has(episodeIndex)) {
      return;
    }

    setLoadingEpisodes(prev => new Set([...prev, episodeIndex]));

    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['episode', animeId, episodeIndex + 1],
        queryFn: () => getEpisodeDetails(animeId, episodeIndex + 1),
        staleTime: 48 * 60 * 60 * 1000, // 48 hours
      });

      setEpisodeDetails(prev => new Map([...prev, [episodeIndex, data.data]]));
    } catch (error) {
      console.error(`Failed to load episode ${episodeIndex + 1} details:`, error);
    } finally {
      setLoadingEpisodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(episodeIndex);
        return newSet;
      });
    }
  }, [animeId, episodeDetails, loadingEpisodes, queryClient]);

  useEffect(() => {
    const loadInitialEpisodes = async (): Promise<void> => {
      const episodesToLoad = Math.min(INITIAL_LOAD_COUNT, episodes.length);
      
      for (let i = 0; i < episodesToLoad; i++) {
        await loadEpisodeDetails(i);
      }

      setLoadedCount(episodesToLoad);
    };

    if (episodes.length > 0 && loadedCount === 0) {
      loadInitialEpisodes();
    }
  }, [episodes.length, animeId, loadEpisodeDetails, loadedCount]);

  const episodeRef = useCallback((node: HTMLDivElement | null, episodeIndex: number): void => {
    if (!node) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt((entry.target as HTMLElement).dataset.episodeIndex || '0');
              loadEpisodeDetails(index);
            }
          });
        },
        {
          threshold: INTERSECTION_THRESHOLD,
          rootMargin: ROOT_MARGIN
        }
      );
    }

    node.dataset.episodeIndex = episodeIndex.toString();
    observerRef.current.observe(node);
  }, [loadEpisodeDetails]);

  return {
    episodeDetails,
    loadingEpisodes,
    loadedCount,
    episodeRef
  };
}
