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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

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
      <img src={"/images/icons/search.svg"} className="mr-3" alt="Search" width={25} height={25} />
      <input 
        type="text" 
        placeholder="Titles, Genres, Platforms" 
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
