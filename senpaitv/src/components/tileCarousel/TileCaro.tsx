"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Tile from "../tile/Tile";
import styles from "./tileCaro.module.css";

export default function TileCarousel({ anime, title, isMal }: { anime: any, title: string, isMal: boolean }) {
  console.log(isMal, anime)
  return (
    <>
    <h2 className={styles.title}>{title}</h2>
    <Swiper
      className={styles.swiper}
      slidesPerView={'auto'}
      allowTouchMove={true}
      spaceBetween={16}
      navigation
      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
      modules={[Navigation, Mousewheel]}
      centeredSlides={true}
      centeredSlidesBounds={true}
      watchSlidesProgress={true}
    >
      {anime?.data.map((media: any) => (
        <SwiperSlide className={styles.swiperSlide} key={media.mal_id}>
          <Tile image={isMal ? media.node.main_picture.large : media.coverImage.extraLarge} title={isMal ? media.node.title : media.title.english} genres={isMal ? media.node.genres.map((genre: any) => genre.name) : media.genres} />
        </SwiperSlide>
        ))}
    </Swiper>
    </>
  );
}
