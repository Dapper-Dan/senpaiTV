import { getUserWatchlist } from '@/app/actions/watchlist';
import { getAnimeByIds } from '@/lib/aniList/public/public';
import WatchlistGrid from '@/components/watchlist/WatchlistGrid';
import { notFound } from 'next/navigation';
import AutoSyncWatchlist from '@/components/watchlist/AutoSyncWatchlist';

export const dynamic = 'force-dynamic';

export default async function WatchlistPage() {
  const watchlistItems = await getUserWatchlist();

  if (!watchlistItems || watchlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your Watchlist is Empty</h1>
          <p className="text-xl text-gray-400">Start adding anime to your watchlist!</p>
        </div>
      </div>
    );
  }
  const ids = watchlistItems.map((item) => parseInt(item.animeId)).filter((n) => !isNaN(n));
  const validAnime = await getAnimeByIds(ids);

  if (validAnime.length === 0) {
    notFound();
  }

  return (
    <div className="page-container py-8">
      <AutoSyncWatchlist />
      <h1 className="text-3xl font-bold mb-12 mt-4 px-10">My Watchlist</h1>
      <WatchlistGrid anime={validAnime} />
    </div>
  );
}
