'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { WatchlistStatus } from '@prisma/client';
import styles from '@/components/tile/tile.module.css';

interface WatchlistButtonProps {
  animeId: string;
  variant?: 'default' | 'tile';
}

export default function WatchlistButton({ animeId, variant = 'default' }: WatchlistButtonProps) {
  const {
    isInWatchlist,
    isLoadingItem,
    isAdding,
    isRemoving,
    addToWatchlist,
    removeFromWatchlist
  } = useWatchlist(animeId);

  if (isLoadingItem) {
    return <div>Loading...</div>;
  }

  if (variant === 'tile') {
    return (
      <button 
        onClick={() => isInWatchlist ? removeFromWatchlist() : addToWatchlist('WANT_TO_WATCH')}
        disabled={isAdding || isRemoving}
        className={`${styles.watchListButton} ${styles.tileButton}`}
        aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {isInWatchlist ? <img src={"/images/icons/checkmark.svg"} alt="" width={41} height={41} /> : <img src={"/images/icons/add.svg"} alt="" width={41} height={41} />}
      </button>
    );
  }

  if (isInWatchlist) {
    return (
      <button 
        onClick={() => removeFromWatchlist()} 
        disabled={isRemoving}
        aria-label="Remove from watchlist"
        title="Remove from watchlist"
      >
        <img src={"/images/icons/checkmark.svg"} className="cursor-pointer" alt="" width={41} height={41} />
      </button>
    );
  }

  return (
    <button 
      onClick={() => addToWatchlist('WANT_TO_WATCH')} 
      disabled={isAdding}
      aria-label="Add to watchlist"
      title="Add to watchlist"
    >
      <img src={"/images/icons/add.svg"} className="cursor-pointer" alt="" width={41} height={41} />
    </button>
  );
}
