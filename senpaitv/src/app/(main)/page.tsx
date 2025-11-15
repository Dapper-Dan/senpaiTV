import Image from "next/image";
import styles from "./page.module.css";
import TileCarousel from "@/components/tileCarousel/TileCaro";
import { getRankedAnime, getTrendingAnime, getGhibliAnime, getIsekaiAnime } from "@/lib/aniList/public/public";

export default async function Home() {
  
  const rankedAnime: any = await getRankedAnime();
  const trendingAnime: any = await getTrendingAnime();
  const ghibliAnime: any = await getGhibliAnime();
  const isekaiAnime: any = await getIsekaiAnime();

  const filterStreamingLinks = (anime: any) => ({
    ...anime,
    externalLinks: anime.externalLinks?.filter((link: any) => link.type === "STREAMING") || []
  });

  const filterAnimeWithStreaming = (anime: any) => {
    const streamingLinks = anime.externalLinks?.filter((link: any) => link.type === "STREAMING") || [];
    return streamingLinks.length > 0;
  };

  const rankedMedia = (rankedAnime?.Page?.media || [])
    .filter(filterAnimeWithStreaming)
    .map(filterStreamingLinks);

  const trendingMedia = (trendingAnime?.Page?.media || [])
    .filter(filterAnimeWithStreaming)
    .map(filterStreamingLinks);

  const isekaiMedia = (isekaiAnime?.Page?.media || [])
    .filter(filterAnimeWithStreaming)
    .map(filterStreamingLinks);

  const ghibliMedia = ((ghibliAnime?.Page?.studios?.[0]?.media?.nodes) || [])
    .filter(filterAnimeWithStreaming)
    .map(filterStreamingLinks);

  return (
    <div className="page-container">
      <main className="flex flex-col">
        <div className={styles.homeBanner}>
          <Image className="" src={"/images/bleach2.jpeg"} alt="Solo Leveling Hero" width={5000} height={1000} style={{ width: "100%", height: "100%" }} />
          <div className="absolute absolute top-[35%] left-[50px]">
            <Image src={"/images/bleach-title.svg"} className="" alt="Bleach" width={500} height={500} />
            <a href="series/116674" className="bg-[#171717] text-[#fefefe] px-6 py-4 rounded-md font-bold ml-4 mt-3 flex w-fit relative z-10">Go to Series</a>
          </div>
        </div>
        <TileCarousel anime={rankedMedia} title="Top Ranked" />
        <TileCarousel anime={trendingMedia} title="Trending" />
        <TileCarousel anime={ghibliMedia} title="Ghibli" />
        <TileCarousel anime={isekaiMedia} title="Isekai" />
      </main>
    </div>
  );
}
