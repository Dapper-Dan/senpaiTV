import Searchbar from "@/components/searchBar/Searchbar";
import styles from "./search.module.css";

export default function Search({searchParams}: {searchParams: {q: string}}) {
  const query = searchParams.q || '';
  return (
    <div className={styles.searchPage}>
      <Searchbar defaultValue={query} />
      {/* {query && <SearchResults query={query} />} */}
    </div>
  );
}
