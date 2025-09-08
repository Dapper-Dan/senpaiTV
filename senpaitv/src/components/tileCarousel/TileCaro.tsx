"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Tile from "../tile/Tile";
import styles from "./tileCaro.module.css";

export default function TileCarousel({ anime, title }: { anime: any, title: string }) {
  console.log(anime)
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
      {anime?.map((media: any) => (
        <SwiperSlide className={styles.swiperSlide} key={media.mal_id}>
          <Tile image={media.coverImage.extraLarge} title={media.title.english} genres={media.genres} score={media.averageScore} />
        </SwiperSlide>
        ))}
    </Swiper>
    </>
  );
}
