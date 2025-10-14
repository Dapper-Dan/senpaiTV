'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./searchBar.module.css";

interface SearchbarProps {
  defaultValue?: string;
}

export default function Searchbar({ defaultValue = '' }: SearchbarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue);
  const router = useRouter();

  // Debounce the query to prevent excessive URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  // Sync with URL changes (browser back/forward)
  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => {
    setQuery('');
    router.push('/search');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchBarContainer}>
      <input 
        type="text" 
        placeholder="Search" 
        className={styles.searchInput} 
        name="search" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button 
          type="button"
          onClick={clearSearch}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </form>
  );
}
