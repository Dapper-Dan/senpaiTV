import { getUserWatchlist } from '@/app/actions/watchlist';
import { getAnimeById } from '@/lib/aniList/public/public';
import WatchlistGrid from '@/components/watchlist/WatchlistGrid';
import { notFound } from 'next/navigation';

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

  const animeDetailsPromises = watchlistItems.map((item) =>
    getAnimeById(parseInt(item.animeId))
  );

  const animeDetails = await Promise.all(animeDetailsPromises);
  const validAnime = animeDetails.filter((anime) => anime !== null);

  if (validAnime.length === 0) {
    notFound();
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>
      <WatchlistGrid anime={validAnime} />
    </div>
  );
}
