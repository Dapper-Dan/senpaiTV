'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { WatchlistStatus } from '@/generated/prisma';

interface WatchlistButtonProps {
  animeId: string;
  className?: string;
}

export default function WatchlistButton({ animeId, className = '' }: WatchlistButtonProps) {
  const {
    isInWatchlist,
    isLoadingItem,
    isAdding,
    isRemoving,
    addToWatchlist,
    removeFromWatchlist
  } = useWatchlist(animeId);

  if (isLoadingItem) {
    return <div className={className}>Loading...</div>;
  }

  if (isInWatchlist) {
    return (
      <button 
        onClick={() => removeFromWatchlist()} 
        disabled={isRemoving}
        className={className}
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>
    );
  }

  return (
    <button 
      onClick={() => addToWatchlist('WANT_TO_WATCH')} 
      disabled={isAdding}
      className={className}
    >
      {isAdding ? 'Adding...' : 'Add to Watchlist'}
    </button>
  );
}
