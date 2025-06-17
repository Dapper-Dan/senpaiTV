import Image from "next/image";
import styles from "./page.module.css";
import TileCarousel from "@/components/tileCarousel/TileCaro";
import { getRankedAnime as getRankedAnimeMal } from "@/lib/mal/public/public";

export default async function Home() {
  const trendingAnime = await getRankedAnimeMal();

  return (
    <div className="page-container">
      <main className="flex flex-col gap-[32px]">
        <div className={styles.homeBanner}>
          <Image src={"/images/solo_leveling_hero3.jpeg"} alt="Solo Leveling Hero" width={1000} height={1000} style={{ width: "100%", height: "100%" }} />
        </div>
        <TileCarousel anime={trendingAnime} title="Trending Anime" />
        <p>
          SenpaiTV is a platform for watching anime.
        </p>
      </main>
    </div>
  );
}
