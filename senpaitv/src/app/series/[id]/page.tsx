import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAnimeById } from '@/lib/aniList/public/public';
import styles from './series.module.css';

interface SeriesPageProps {
  params: {
    id: string;
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { id } = params;

  const anime = await getAnimeById(parseInt(id));

  if (!anime) {
    notFound();
  }

  const {
    coverImage,
    title,
    genres,
    averageScore,
    bannerImage,
    stats,
    description,
    trailer,
    episodes,
    duration,
    status,
    season,
    seasonYear,
    studios,
    externalLinks
  } = anime;

  const formattedScore = averageScore ? `${(averageScore / 10).toFixed(1)}` : "N/A";
  const usersSubmitted = stats?.scoreDistribution.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0);
  const cleanDescription = description?.replace(/<[^>]*>/g, '') || 'Description not available';
  const streamingLinks = externalLinks?.filter((link: any) => link.type === "STREAMING") || [];

  let trailerLink = trailer ? `https://www.youtube-nocookie.com/embed/${trailer.id}?autoplay=1&mute=1&loop=1&controls=0&playlist=${trailer.id}&enablejsapi=1&rel=0` : null;

  return (
    <div className="">
      <div className="relative overflow-hidden">
        {trailerLink && <iframe src={trailerLink} className={styles.seriesTrailer} width={280} height={100} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />}
        {!trailerLink && <Image src={bannerImage} className={styles.seriesBanner} alt={title.english} width={280} height={100} />}
        <div className={styles.seriesBannerOverlay}></div>
      </div>
      <div className={styles.seriesContent}>
        <div className="flex gap-8 items-end px-8">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">
              {title.english || title.romaji}
            </h1>
            <div className="flex flex-wrap gap-4 mb-6">
              {genres.slice(0, 5).map((genre: string) => (
                <span
                  key={genre}
                  className="text-sm font-bold"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {formattedScore} ★
                </span>
                <span className="">
                  ({usersSubmitted?.toLocaleString()} users)
                </span>
              </div>
              {episodes && (
                <span className="text-lg">
                  {episodes} episodes
                </span>
              )}
              {duration && (
                <span className="text-lg">
                  {duration} min/ep
                </span>
              )}
              <button><img src={"/images/icons/add.svg"} alt="Watchhlist" title="Add to My List" width={40} height={40} /></button>
              <div className="flex gap-2">
                <Image src={"/images/icons/netflix-logo.png"} alt="Netflix" title="Netflix" width={40} height={40} />
                <Image src={"/images/icons/hulu-logo.png"} alt="Hulu" title="Hulu" width={40} height={40} />
                <Image src={"/images/icons/cr-logo.png"} alt="Crunchyroll" title="Crunchyroll" width={40} height={40} />
              </div>
            </div>
            <div className="flex justify-between">
              <p className="leading-relaxed max-w-4/7">
                {cleanDescription}
              </p>
              <div className={"grid grid-cols-2 gap-4 " + styles.seriesDetails}>
                {status && (
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 capitalize">{status.toLowerCase()}</span>
                  </div>
                )}
                {season && seasonYear && (
                  <div>
                    <span className="text-gray-400">Season:</span>
                    <span className="ml-2 capitalize">{season.toLowerCase()} {seasonYear}</span>
                  </div>
                )}
                {studios && studios.nodes.length > 0 && (
                  <div>
                    <span className="text-gray-400">Studio:</span>
                    <span className="ml-2">{studios.nodes[0].name}</span>
                  </div>
                )}
                {episodes && (
                  <div>
                    <span className="text-gray-400">Episodes:</span>
                    <span className="ml-2">{episodes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: SeriesPageProps) {
  const { id } = params;

  const anime = await getAnimeById(parseInt(id));

  if (!anime) {
    return {
      title: 'Anime Not Found - SenpaiTV',
    };
  }

  return {
    title: `${anime.title.english || anime.title.romaji} - SenpaiTV`,
    description: anime.description ? anime.description.replace(/<[^>]*>/g, '').substring(0, 160) : 'SenpaiTV is a website that allows you to watch anime and manga.',
  };
}
