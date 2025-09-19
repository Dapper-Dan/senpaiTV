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
  const [fullyVisibleIndexes, setFullyVisibleIndexes] = useState<number[]>([]);
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

  const checkFullyVisibleSlides = () => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    const swiperContainer = swiper.el;
    const slides = swiper.slides;
    
    const newFullyVisibleIndexes:any = [];
    const containerRect = swiperContainer.getBoundingClientRect();

    slides.forEach((slide: HTMLElement, index: number) => {
      const slideRect = slide.getBoundingClientRect();
      const isFullyVisible =
        slideRect.left >= containerRect.left &&
        slideRect.right <= containerRect.right &&
        slideRect.top >= containerRect.top &&
        slideRect.bottom <= containerRect.bottom;

      if (isFullyVisible) {
        newFullyVisibleIndexes.push(index);
      }
    });

    setFullyVisibleIndexes(newFullyVisibleIndexes);
  };

  const handleSwiperInit = (swiper: any) => {
    swiperRef.current = swiper;
    checkFullyVisibleSlides();

    swiper.on('transitionEnd', checkFullyVisibleSlides);
    swiper.on('progress', checkFullyVisibleSlides);
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
      onSwiper={handleSwiperInit}
      modules={[Navigation]}
      centeredSlides={true}
      centeredSlidesBounds={true}
      watchSlidesProgress={true}
      initialSlide={0}
    >
      {anime?.map((media: any, index: number) => {
        const isFirstVisible = fullyVisibleIndexes.length > 0 && index === fullyVisibleIndexes[0];
        const isLastVisible = fullyVisibleIndexes.length > 0 && index === fullyVisibleIndexes[fullyVisibleIndexes.length - 1];
        
        return (
          <SwiperSlide className={styles.swiperSlide} key={media.id}>
            <Tile 
              anime={media}
              isActive={activeTile?.id === media.id}
              onActivate={handleTileHover}
              onDeactivate={handleTileLeave}
              isFirstVisible={isFirstVisible}
              isLastVisible={isLastVisible} />
          </SwiperSlide>
        );
      })}
    </Swiper>
    </>
  );
}
