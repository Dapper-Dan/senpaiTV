'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addToWatchlist, removeFromWatchlist, getWatchlistItem } from '@/app/actions/watchlist';
import { setAniListStatus } from '@/app/actions/aniList';
import { useAniListToken } from '@/lib/aniList/client/useAniListToken';
import { emitAniListOk, emitAniListError } from '@/lib/aniList/client/events';
import { WatchlistStatus } from '@prisma/client';

export function useWatchlist(animeId?: string) {
  const queryClient = useQueryClient();
  const { token } = useAniListToken();

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
        const t = token;
        if (t && animeId) {
          try {
            await setAniListStatus(t, parseInt(animeId), 'PLANNING');
            emitAniListOk();
          } catch (e) {
            console.warn('AniList set status failed');
            emitAniListError();
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
