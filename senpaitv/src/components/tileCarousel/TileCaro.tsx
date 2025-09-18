"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Tile from "../tile/Tile";
import styles from "./tileCaro.module.css";
import { useState, useEffect, useRef } from "react";

export default function TileCarousel({ anime, title }: { anime: any, title: string }) {
  const [activeTile, setActiveTile] = useState<{id: string, rect: DOMRect} | null>(null);
  const activeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTileHover = (tileId: string, rect: DOMRect) => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
    }
    
    setActiveTile(null);
    
    activeTimeoutRef.current = setTimeout(() => {
      setActiveTile({id: tileId, rect});
    }, 400);
  };

  const handleTileLeave = () => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    setActiveTile(null);
  };

  useEffect(() => {
    return () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
    <h2 className={styles.title}>{title}</h2>
    <Swiper
      className={styles.swiper}
      slidesPerView={'auto'}
      allowTouchMove={true}
      spaceBetween={16}
      navigation
      modules={[Navigation]}
      centeredSlides={false}
      centeredSlidesBounds={false}
      watchSlidesProgress={true}
    >
      {anime?.map((media: any) => (
        <SwiperSlide className={styles.swiperSlide} key={media.id}>
          <Tile 
            anime={media}
            isActive={activeTile?.id === media.id}
            onActivate={handleTileHover}
            onDeactivate={handleTileLeave} />
        </SwiperSlide>
        ))}
    </Swiper>
    </>
  );
}
