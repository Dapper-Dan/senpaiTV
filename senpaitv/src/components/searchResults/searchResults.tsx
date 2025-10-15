'use client';

import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '@/lib/aniList/public/public';
import Tile from '@/components/tile/Tile';
import { useState, useEffect, useRef } from 'react';
import styles from './searchResults.module.css';

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [tileWidth, setTileWidth] = useState(160);
  const gridRef = useRef<HTMLDivElement>(null);
  const activeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAnime(query),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000,
  });

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
  }, [searchResults]);

  if (isLoading) {
    return (
      <div>
        <p>Searching for "{query}"...</p>
      </div>
    );
  }

  if (error || !searchResults || searchResults.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>Sorry, we couldn't find any results for "{query}".</h2>
        <p>Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.resultsTitle}>
        Search Results for "{query}" ({searchResults.length} found)
      </h2>
      <div
        ref={gridRef}
        className={styles.resultsGrid}
      >
        {searchResults.map((anime: any) => (
          <Tile
            key={anime.id}
            anime={anime}
            isActive={activeTileId === anime.id}
            onActivate={handleTileHover}
            onDeactivate={handleTileLeave}
            tileWidth={tileWidth}
          />
        ))}
      </div>
    </div>
  );
}
