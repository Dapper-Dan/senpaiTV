'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addToWatchlist, removeFromWatchlist, getWatchlistItem } from '@/app/actions/watchlist';
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
    mutationFn: ({ status, onSuccess }: { status: WatchlistStatus; onSuccess?: () => void }) => 
      addToWatchlist(animeId!, status).then(() => onSuccess?.()),
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (onSuccess?: () => void) => 
      removeFromWatchlist(animeId!).then(() => onSuccess?.()),
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlist']);
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
