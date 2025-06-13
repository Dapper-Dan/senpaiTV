"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Tile from "../tile/Tile";
import styles from "./tileCaro.module.css";

export default function TileCarousel({ anime }: { anime: any }) {
  return (
    <Swiper
      className={styles.swiper}
      slidesPerView={'auto'}
      allowTouchMove={true}
      loop={true}
      spaceBetween={16}
    >
      {anime.data.map((media: any) => (
        <SwiperSlide className={styles.swiperSlide} key={media.node.id}>
          <Tile image={media.node.main_picture.large} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
