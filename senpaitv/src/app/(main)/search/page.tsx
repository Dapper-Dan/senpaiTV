import Searchbar from "@/components/searchBar/Searchbar";
import styles from "./search.module.css";
import SearchResults from "@/components/searchResults/searchResults";

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';
  return (
    <div className={styles.searchPage}>
      <Searchbar defaultValue={query} />
      {query && <SearchResults query={query} />}
    </div>
  );
}
