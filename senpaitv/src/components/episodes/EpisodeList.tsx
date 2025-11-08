'use client';
import { useState } from 'react';
import { useEpisodeDescription } from '@/hooks/useEpisodeDescription';
import styles from '../../app/(main)/series/[id]/series.module.css';
import Image from 'next/image';
import EpisodeProviderModal from '../episodeProviderModal/EpisodeProviderModal';

interface EpisodesListProps {
  episodes: any[];
  animeId: number;
  externalLinks: any[];
  aniListId: number;
}

export default function EpisodesList({ episodes, animeId, externalLinks, aniListId}: EpisodesListProps) {
  const { episodeDetails, loadingEpisodes, loadedCount, episodeRef } = useEpisodeDescription(episodes, animeId);
  const [selectedEpisode, setSelectedEpisode] = useState<{number: number, title: string} | null>(null);

  const handlePlayClick = (episodeNumber: number, episodeTitle: string) => {
    setSelectedEpisode({ number: episodeNumber, title: episodeTitle });
    const body = document.body;
    body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedEpisode(null);
    const body = document.body;
    body.style.overflow = 'auto';
  };

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
            <button 
              className={styles.playButton}
              onClick={() => handlePlayClick(index + 1, episode.title.replace(/^Episode \d+ - /, ''))}
            >
              <img src={"/images/icons/play-2.svg"} alt="Play" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{episode.title.replace(/^Episode \d+ - /, '')}</h2>
            {loadingEpisodes.has(index) && (
              <div className="">Loading synopsis...</div>
            )}
            {episodeDetails.get(index)?.synopsis ? (
              <p className="text-gray-200 mt-2">
                {episodeDetails.get(index)?.synopsis.replace(/\s*\(Source:.*?\)$/i, '')}
              </p>
            ) : !loadingEpisodes.has(index) && (
              <p className="text-gray-400 italic mt-2">Synopsis not available</p>
            )}
          </div>
        </div>
      ))}

      {selectedEpisode && (
        <EpisodeProviderModal
          isOpen={true}
          onClose={handleCloseModal}
          episodeTitle={selectedEpisode.title}
          episodeNumber={selectedEpisode.number}
          externalLinks={externalLinks}
          animeId={animeId}
          aniListId={aniListId}
          episodes={episodes}
        />
      )}
    </div>
  );
}
