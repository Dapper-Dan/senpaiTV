import Image from "next/image";
import Link from "next/link";
import styles from "./tile.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import WatchlistButton from "../watchlist/WatchlistButton";

interface TileProps {
  anime: any;
  isActive: boolean;
  onActivate: (id: string, rect: DOMRect) => void;
  onDeactivate: () => void;
  tileWidth: number;
}

const streamingAppImages: any = {
  "Crunchyroll": "/images/icons/cr-logo.png",
  "Hulu": "/images/icons/hulu-logo.png",
  "Netflix": "/images/icons/netflix-logo.png",
}

export default function Tile({ anime, isActive, onActivate, onDeactivate, tileWidth }: TileProps) {
  const { coverImage, title, genres, averageScore, bannerImage, stats, description, trailer, externalLinks } = anime;
  const formattedScore = averageScore ? `${(averageScore / 10).toFixed(1)}` : "N/A";
  const usersSubmitted = stats?.scoreDistribution.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0);

  const [tileRect, setTileRect] = useState<DOMRect | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    const adjustedRect = {
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      width: rect.width,
      height: rect.height,
      right: rect.right + scrollX,
      bottom: rect.bottom + scrollY
    } as DOMRect;

    setTileRect(adjustedRect);

    onDeactivate();

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(() => {
      onActivate(anime.id, adjustedRect);
    }, 300);

    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const modalWidth = tileWidth * 2.7;

  const calculateModalLeft = () => {
    if (!tileRect) return 0;
    
    const centeredLeft = tileRect.left + (tileRect.width / 2) - (modalWidth / 2);
    const centeredRight = centeredLeft + modalWidth;
    
    const wouldOverflowLeft = centeredLeft < 0;
    const wouldOverflowRight = centeredRight > window.innerWidth;
    
    if (wouldOverflowLeft) {
      return Math.max(0, tileRect.left);
    } else if (wouldOverflowRight) {
      return tileRect.left - (modalWidth - tileRect.width);
    } else {
      return centeredLeft;
    }
  };

  const plainDescription = (description || '').replace(/<[^>]*>/g, '');

  let trailerLink = trailer ? `https://www.youtube-nocookie.com/embed/${trailer.id}?autoplay=1&mute=0&loop=1&controls=0&playlist=${trailer.id}&enablejsapi=1&rel=0` : null;
  const seenSites = new Set();

  return (
    <>
      <div className={styles.tile} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link href={`/series/${anime.id}`}>
          <Image className={styles.image} src={coverImage.extraLarge} alt={title.english || 'anime image'} width={280} height={420} />
        </Link>
        <h3 className={styles.title}>{title.english}</h3>
        <div className="lg:flex lg:justify-between lg:items-center">
          <ul className={styles.genres}>
            {genres.slice(0, 3).map((genre: string) => (
              <li key={genre} className={styles.genreItem}>
                {genre}
              </li>
            ))}
          </ul>
          <p className={styles.score}>{formattedScore} ★</p>
        </div>
      </div>
      {isActive && tileRect && createPortal(
        <div
          className={styles.expandedTile}
          style={{
            position: 'absolute',
            top: tileRect.top + (tileRect.height / 2),
            left: calculateModalLeft(),
            zIndex: 1000,
            width: modalWidth + 'px',
          }}
          onMouseLeave={onDeactivate}
        >
          {trailerLink && <iframe src={trailerLink} className={styles.tileTrailer} width={280} height={100} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />}
          {!trailerLink && <div className={styles.tileBanner} style={{ backgroundImage: `url(${bannerImage})` }}></div>}
          <div className={styles.contentContainer}>
            <h3 className="text-2xl font-bold">{title.english}</h3>
            <ul className={styles.genres}>
              {genres.slice(0, 3).map((genre: string) => (
                <li key={genre} className={styles.genreItem}>
                  {genre}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <p className={styles.score + ' mr-2'}>{formattedScore} ★ ({usersSubmitted})</p>
              {externalLinks.map((link: any) => {
                if (streamingAppImages[link.site] && !seenSites.has(link.site)) {
                  seenSites.add(link.site);
                  return (
                    <Image key={link.site} src={streamingAppImages[link.site]} alt={link.site} width={25} height={25} />
                  )
                }
              })}
            </div>
            <p className={styles.description} title={plainDescription || ''}>
              {plainDescription.replace(/\s*\(Source:.*?\)$/i, '') || 'Description not available'}
            </p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.playButton + ' ' + styles.tileButton}><img src={"/images/icons/play.svg"} alt="Play" /></button>
            <WatchlistButton animeId={anime.id.toString()} variant="tile" />
            <Link
              href={`/series/${anime.id}`}
              className={styles.expandButton + ' ' + styles.tileButton}
            >
              <img src={"/images/icons/chevron-down.svg"} alt="Expand" />
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
