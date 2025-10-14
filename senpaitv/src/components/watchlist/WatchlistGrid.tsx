'use client';

import { useState, useEffect, useRef } from 'react';
import Tile from '@/components/tile/Tile';

interface WatchlistGridProps {
  anime: any[];
}

export default function WatchlistGrid({ anime }: WatchlistGridProps) {
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [tileWidth, setTileWidth] = useState(160);
  const gridRef = useRef<HTMLDivElement>(null);
  const activeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTileHover = (tileId: string) => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
    }

    setActiveTileId(null);

    activeTimeoutRef.current = setTimeout(() => {
      setActiveTileId(tileId);
    }, 300);
  };

  const handleTileLeave = () => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    setActiveTileId(null);
  };

  const updateTileWidth = () => {
    if (gridRef.current) {
      const firstTile = gridRef.current.firstElementChild as HTMLElement;
      if (firstTile) {
        const computedStyle = getComputedStyle(firstTile);
        setTileWidth(parseInt(computedStyle.width));
      }
    }
  };

  useEffect(() => {
    setTimeout(updateTileWidth, 0);
    window.addEventListener('resize', updateTileWidth);

    return () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
      window.removeEventListener('resize', updateTileWidth);
    };
  }, [anime]);


  return (
    <div
      ref={gridRef}
      className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-8 
                 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
                 xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
                 2xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
    >
      {anime.map((item) => (
        <Tile
          key={item.id}
          anime={item}
          isActive={activeTileId === item.id}
          onActivate={handleTileHover}
          onDeactivate={handleTileLeave}
          tileWidth={tileWidth}
        />
      ))}
    </div>
  );
}
