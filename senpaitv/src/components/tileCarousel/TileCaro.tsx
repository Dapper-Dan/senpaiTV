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
  const [tileWidth, setTileWidth] = useState(0);
  const activeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const swiperRef = useRef<any>(null);

  const handleTileHover = (tileId: string, rect: DOMRect) => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
    }
    
    setActiveTile(null);
    
    activeTimeoutRef.current = setTimeout(() => {
      setActiveTile({id: tileId, rect});
    }, 300);
  };

  const handleTileLeave = () => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    setActiveTile(null);
  };

  const updateTileWidth = () => {
    if (typeof window === 'undefined') return;
    
    const firstSlide = document.querySelector('.swiper-slide');
    if (!firstSlide) return;
    
    const computedStyle = getComputedStyle(firstSlide);
    setTileWidth(parseInt(computedStyle.width));
  };

  const handleSwiperInit = (swiper: any) => {
    swiperRef.current = swiper;
    updateTileWidth();
  };

  useEffect(() => {
    window.addEventListener('resize', updateTileWidth);
    
    return () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
      window.removeEventListener('resize', updateTileWidth);
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
      onSwiper={handleSwiperInit}
      modules={[Navigation]}
      centeredSlides={true}
      centeredSlidesBounds={true}
      watchSlidesProgress={true}
      initialSlide={0}
    >
      {anime?.map((media: any) => (
        <SwiperSlide className={styles.swiperSlide} key={media.id}>
          <Tile 
            anime={media}
            tileWidth={tileWidth}
            isActive={activeTile?.id === media.id}
            onActivate={handleTileHover}
            onDeactivate={handleTileLeave}
          />
        </SwiperSlide>
      ))}
    </Swiper>
    </>
  );
}
