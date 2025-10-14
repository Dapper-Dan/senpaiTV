import Searchbar from "@/components/searchBar/Searchbar";

export default function Search({searchParams}: {searchParams: {q: string}}) {
  const query = searchParams.q || '';
  return (
    <div className="page-container">
      <Searchbar defaultValue={query} />
      {/* {query && <SearchResults query={query} />} */}
    </div>
  );
}
