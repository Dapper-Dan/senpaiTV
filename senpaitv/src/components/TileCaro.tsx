import Tile from "./tile/Tile";
import { getTrendingAnime } from "@/lib/aniList/public/public";
import { getTrendingAnime as getTrendingAnimeMal } from "@/lib/mal/public/public";

export default async function TileCarousel() {
  const trendingAnime: any = await getTrendingAnime();
  const trendingAnimeMal: any = await getTrendingAnimeMal();
  console.log(trendingAnime);
  console.log(trendingAnimeMal);

  return (
    <div className="tile-carousel flex gap-4">
      {trendingAnimeMal.data.map((anime: any) => (
        <Tile key={anime.node.id} image={anime.node.main_picture.large} />
      ))}
    </div>
  );
}
