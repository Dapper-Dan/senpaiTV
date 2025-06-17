"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Tile from "../tile/Tile";
import styles from "./tileCaro.module.css";

export default function TileCarousel({ anime }: { anime: any }) {
  return (
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
      {anime.data.map((media: any) => (
        <SwiperSlide className={styles.swiperSlide} key={media.node.id}>
          <Tile image={media.node.main_picture.large} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
