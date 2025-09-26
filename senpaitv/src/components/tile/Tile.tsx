import Image from "next/image";
import styles from "./tile.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TileProps {
  anime: any;
  isActive: boolean;
  onActivate: (id: string, rect: DOMRect) => void;
  onDeactivate: () => void;
  isFirstVisible: boolean;
  isLastVisible: boolean;
  tileWidth: number;
}

export default function Tile({ anime, isActive, onActivate, onDeactivate, isFirstVisible, isLastVisible, tileWidth }: TileProps) {
  const { coverImage, title, genres, averageScore, bannerImage, stats, description, trailer } = anime;
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

  let parser = new DOMParser();
  let parsedDescription = parser.parseFromString(description, 'text/html');

  let trailerLink = trailer ? `https://www.youtube-nocookie.com/embed/${trailer.id}?autoplay=1&mute=0&loop=1&controls=0&playlist=${trailer.id}&enablejsapi=1&rel=0` : null;

  return (
    <>
    <div className={styles.tile} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Image className={styles.image} src={coverImage.extraLarge} alt={title.english} width={280} height={420} />
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
            left: isFirstVisible ? tileRect.left : isLastVisible ? tileRect.left - (modalWidth - tileRect.width ) : tileRect.left + (tileRect.width / 2) - (modalWidth / 2),
            zIndex: 1000,
            width: modalWidth + 'px',
          }}
          onMouseLeave={onDeactivate}
        >
          {trailerLink && <iframe src={trailerLink} className={styles.tileTrailer} width={280} height={100} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />}
          {!trailerLink && <Image src={bannerImage} alt={title.english} width={280} height={100} />}
          <div className={styles.contentContainer}>
            <h3 className="text-2xl font-bold">{title.english}</h3>
            <ul className={styles.genres}>
              {genres.slice(0, 3).map((genre: string) => (
                <li key={genre} className={styles.genreItem}>
                  {genre}
                </li>
              ))}
            </ul>
            <p className={styles.score}>{formattedScore} ★ ({usersSubmitted})</p>
            <p className={styles.description} title={parsedDescription.body.textContent || ''}>{parsedDescription.body.textContent || 'Description not available'}</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.playButton + ' ' + styles.tileButton}><img src={"/images/icons/play.svg"} alt="Play" /></button>
            <button className={styles.wishlistButton + ' ' + styles.tileButton}><img src={"/images/icons/add.svg"} alt="Wishlist" /></button>
            <button className={styles.expandButton + ' ' + styles.tileButton}><img src={"/images/icons/chevron-down.svg"} alt="Expand" /></button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
