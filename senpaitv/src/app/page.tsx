import Image from "next/image";
import styles from "./page.module.css";
import TileCarousel from "@/components/tileCarousel/TileCaro";
import { getRankedAnime, getTrendingAnime, getGhibliAnime, getIsekaiAnime } from "@/lib/aniList/public/public";

export default async function Home() {
  const rankedAnime = await getRankedAnime();
  const trendingAnime = await getTrendingAnime();
  const ghibliAnime = await getGhibliAnime();
  const isekaiAnime = await getIsekaiAnime();

  const normalizedGhibliAnime = {
    data: (ghibliAnime as any).Page.studios[0].media.nodes.filter(series => series.title?.english)
  };

  return (
    <div className="page-container">
      <main className="flex flex-col gap-[32px]">
        <div className={styles.homeBanner}>
          <Image src={"/images/solo_leveling_hero3.jpeg"} alt="Solo Leveling Hero" width={1000} height={1000} style={{ width: "100%", height: "100%" }} />
        </div>
        <TileCarousel anime={rankedAnime.Page.media} title="Top Ranked" />
        <TileCarousel anime={trendingAnime.Page.media} title="Trending" />
        <TileCarousel anime={normalizedGhibliAnime.data} title="Ghibli" />
        <TileCarousel anime={isekaiAnime.Page.media} title="Isekai" />
      </main>
    </div>
  );
}
