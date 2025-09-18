import Image from "next/image";
import styles from "./tile.module.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TileProps {
  anime: any;
  isActive: boolean;
  onActivate: (id: string, rect: DOMRect) => void;
  onDeactivate: () => void;
}

export default function Tile({ anime, isActive, onActivate, onDeactivate }: TileProps) {
  const { coverImage, title, genres, averageScore } = anime;
  const formattedScore = averageScore ? `${(averageScore / 10).toFixed(1)}` : "N/A";

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
      bottom: rect.bottom + scrollY,
      x: rect.x + scrollX,
      y: rect.y + scrollY
    } as DOMRect;
    
    setTileRect(adjustedRect);
    
    onDeactivate();
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = setTimeout(() => {
      onActivate(anime.id, adjustedRect);
    }, 400);
    
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

  return (
    <>
    <div className={styles.tile} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Image className={styles.image} src={coverImage.extraLarge} alt={title.english} width={280} height={420} />
      <h3 className={styles.title}>{title.english}</h3>
      <div className="flex justify-between items-center">
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
            top: tileRect.top,
            left: tileRect.left,
            zIndex: 1000,
            backgroundColor: 'black',
            width: '31vw',
            height: '31vw',
          }}
          onMouseLeave={onDeactivate}
        >
          todo: add modal content here
        </div>,
        document.body
      )}
    </>
  );
}
