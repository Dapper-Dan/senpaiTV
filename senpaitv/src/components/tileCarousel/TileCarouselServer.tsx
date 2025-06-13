import { getRankedAnime as getRankedAnimeMal } from "@/lib/mal/public/public";
import TileCarousel from "./TileCaro";

export default async function TileCarouselServer() {
  const rankedAnimeMal = await getRankedAnimeMal();
  return <TileCarousel anime={rankedAnimeMal} />;
} 
