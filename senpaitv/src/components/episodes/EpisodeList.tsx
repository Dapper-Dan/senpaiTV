'use client';
import { useEpisodeDescription } from '@/hooks/useEpisodeDescription';
import styles from '../../app/series/[id]/series.module.css';
import Image from 'next/image';

interface EpisodesListProps {
  episodes: any[];
  animeId: number;
}

export default function EpisodesList({ episodes, animeId }: EpisodesListProps) {
  const { episodeDetails, loadingEpisodes, loadedCount, episodeRef } = useEpisodeDescription(episodes, animeId);

  return (
    <div className="episodes-section">
      <h2 className="text-3xl font-bold mb-8">Episodes</h2>
      {episodes.map((episode: any, index: number) => (
        <div
          className={styles.episodeCard}
          key={index}
          ref={(node) => {
            if (index >= loadedCount) {
              episodeRef(node, index);
            }
          }}
        >
          <span className="text-3xl text-gray-400 font-bold content-center">{index + 1}</span>
          <div className={styles.episodeThumbnailContainer}>
            <Image src={episode.thumbnail} className={styles.episodeThumbnail} alt={episode.title} width={200} height={150} />
            <button className={styles.playButton }><img src={"/images/icons/play-2.svg"} alt="Play" /></button>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{episode.title.replace(/^Episode \d+ - /, '')}</h2>
            {loadingEpisodes.has(index) && (
              <div className="">Loading synopsis...</div>
            )}
            {episodeDetails.get(index)?.synopsis && (
              <p className="text-gray-200 mt-2">
                {episodeDetails.get(index)?.synopsis.replace(/\s*\(Source:.*?\)$/i, '')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
