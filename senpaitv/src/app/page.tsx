import Image from "next/image";
import styles from "./page.module.css";
import TileCarousel from "@/components/tileCarousel/TileCaro";
import { getRankedAnime, getTrendingAnime, getGhibliAnime, getIsekaiAnime } from "@/lib/aniList/public/public";

export default async function Home() {
  const rankedAnime = await getRankedAnime();
  const trendingAnime = await getTrendingAnime();
  const ghibliAnime = await getGhibliAnime();
  const isekaiAnime = await getIsekaiAnime();

  const filterStreamingLinks = (anime: any) => ({
    ...anime,
    externalLinks: anime.externalLinks?.filter((link: any) => link.type === "STREAMING") || []
  });

  const filterAnimeWithStreaming = (anime: any) => {
    const streamingLinks = anime.externalLinks?.filter((link: any) => link.type === "STREAMING") || [];
    return streamingLinks.length > 0;
  };

  const filteredRankedAnime = {
    ...rankedAnime,
    Page: {
      ...rankedAnime.Page,
      media: rankedAnime.Page.media
      .filter(filterAnimeWithStreaming)
      .map(filterStreamingLinks)
    }
  };

  const filteredTrendingAnime = {
    ...trendingAnime,
    Page: {
      ...trendingAnime.Page,
      media: trendingAnime.Page.media
      .filter(filterAnimeWithStreaming)
      .map(filterStreamingLinks)
    }
  };

  const filteredIsekaiAnime = {
    ...isekaiAnime,
    Page: {
      ...isekaiAnime.Page,
      media: isekaiAnime.Page.media
      .filter(filterAnimeWithStreaming)
      .map(filterStreamingLinks)
    }
  };

  const filteredGhibliAnime = {
    ...ghibliAnime,
    Page: {
      ...ghibliAnime.Page,
        media: ghibliAnime.Page.studios[0].media.nodes
        .filter(filterAnimeWithStreaming)
        .map(filterStreamingLinks)
    }
  };
      
  

  return (
    <div className="page-container">
      <main className="flex flex-col">
        <div className={styles.homeBanner}>
          <Image className="" src={"/images/bleach2.jpeg"} alt="Solo Leveling Hero" width={5000} height={1000} style={{ width: "100%", height: "100%" }} />
        </div>
        <TileCarousel anime={filteredRankedAnime.Page.media} title="Top Ranked" />
        <TileCarousel anime={filteredTrendingAnime.Page.media} title="Trending" />
        <TileCarousel anime={filteredGhibliAnime.Page.media} title="Ghibli" />
        <TileCarousel anime={filteredIsekaiAnime.Page.media} title="Isekai" />
      </main>
    </div>
  );
}
