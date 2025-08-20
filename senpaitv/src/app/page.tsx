import Image from "next/image";
import styles from "./page.module.css";
import TileCarousel from "@/components/tileCarousel/TileCaro";
import { getRankedAnime as getRankedAnimeMal } from "@/lib/mal/public/public";
import { getTrendingAnime as getTrendingAnime } from "@/lib/aniList/public/public";
import { getGhibliAnime as getGhibliAnime } from "@/lib/aniList/public/public";
import { getIsekaiAnime as getIsekaiAnime } from "@/lib/aniList/public/public";

export default async function Home() {
  const rankedAnime = await getRankedAnimeMal();
  const trendingAnime = await getTrendingAnime() as { Page: { media: any[] } };
  const ghibliAnime = await getGhibliAnime() as { Page: { studios: { media: { nodes: any[] } } } };
  const isekaiAnime = await getIsekaiAnime() as { Page: { media: any[] } };
  const normalizedRankedAnime = { data: rankedAnime.data };
  const normalizedTrendingAnime = { data: trendingAnime.Page.media };
  const normalizedGhibliAnime = {
    data: (ghibliAnime as any).Page.studios[0].media.nodes.filter(series => series.title?.english)
  };
  const normalizedIsekaiAnime = { data: isekaiAnime.Page.media };

  return (
    <div className="page-container">
      <main className="flex flex-col gap-[32px]">
        <div className={styles.homeBanner}>
          <Image src={"/images/solo_leveling_hero3.jpeg"} alt="Solo Leveling Hero" width={1000} height={1000} style={{ width: "100%", height: "100%" }} />
        </div>
        <TileCarousel anime={normalizedRankedAnime} isMal={true} title="Top Ranked" />
        <TileCarousel anime={normalizedTrendingAnime} isMal={false} title="Trending" />
        <TileCarousel anime={normalizedGhibliAnime} isMal={false} title="Ghibli" />
        <TileCarousel anime={normalizedIsekaiAnime} isMal={false} title="Isekai" />
      </main>
    </div>
  );
}
