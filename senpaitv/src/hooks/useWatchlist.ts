'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addToWatchlist, removeFromWatchlist, getWatchlistItem } from '@/app/actions/watchlist';
import { setAniListStatus } from '@/app/actions/aniList';
import { WatchlistStatus } from '@/generated/prisma';

export function useWatchlist(animeId?: string) {
  const queryClient = useQueryClient();

  const { data: watchlistItem, isLoading: isLoadingItem } = useQuery({
    queryKey: ['watchlist', animeId],
    queryFn: () => getWatchlistItem(animeId!),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: async ({ status, onSuccess }: { status: WatchlistStatus; onSuccess?: () => void }) => {
      await addToWatchlist(animeId!, status);

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('anilist_access_token');
        if (token && animeId) {
          try {
            await setAniListStatus(token, parseInt(animeId), 'PLANNING');
            try { window.dispatchEvent(new Event('anilist-ok')); } catch {}
          } catch (e) {
            console.warn('AniList set status failed');
            try { window.dispatchEvent(new Event('anilist-error')); } catch {}
          }
        }
      }
      onSuccess?.();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (onSuccess?: () => void) => 
      removeFromWatchlist(animeId!).then(() => onSuccess?.()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  return {
    watchlistItem,
    isLoadingItem,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    addToWatchlist: (status: WatchlistStatus = 'WANT_TO_WATCH', onSuccess?: () => void) => 
      addMutation.mutate({ status, onSuccess }),
    removeFromWatchlist: (onSuccess?: () => void) => 
      removeMutation.mutate(onSuccess),
    isInWatchlist: !!watchlistItem,
  };
}
