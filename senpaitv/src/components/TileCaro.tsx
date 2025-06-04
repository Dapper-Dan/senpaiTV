import Tile from "./tile/Tile";
import { getTrendingAnime } from "@/lib/aniList/public";

export default async function TileCarousel() {
  const trendingAnime: any = await getTrendingAnime();
  console.log(trendingAnime);

  return (
    <div className="tile-carousel flex gap-4">
      {trendingAnime.Page.media.map((anime: any) => (
        <Tile key={anime.id} image={anime.coverImage.large} />
      ))}
    </div>
  );
}
