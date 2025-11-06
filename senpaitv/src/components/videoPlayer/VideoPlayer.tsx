'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  title?: string;
  src: string;
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
}

export default function VideoPlayer({ title, src, onNextEpisode, hasNextEpisode = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const startHideTimer = () => {
    clearTimeout(hideTimer.current!);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  useEffect(() => {
    startHideTimer();
    return () => clearTimeout(hideTimer.current!);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(hideTimer.current!);
    setVisible(true);
  };

  const handleMouseLeave = () => {
    startHideTimer();
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="relative bg-black min-h-0">
        <video
          ref={videoRef}
          className="w-full"
          src={src}
          autoPlay
          playsInline
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement;
            setDuration(video.duration || 0);
          }}
          onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Video error:', e);
            const video = e.target as HTMLVideoElement;
            console.error('Error code:', video.error?.code);
            console.error('Error message:', video.error?.message);
          }}
        />
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div
            ref={progressRef}
            className="w-full cursor-pointer"
            onClick={(e) => {
              if (!videoRef.current || !progressRef.current) return;
              const rect = progressRef.current.getBoundingClientRect();
              const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
              const newTime = ratio * duration;
              videoRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }}
          >
            <div
              className="h-2 bg-red-600 rounded"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-black/5">
            <div className="flex items-center gap-2 text-sm">
              <button
                className="px-3 py-1"
                onClick={async () => { 
                  const v = videoRef.current; 
                  if (!v) return; 
                  try {
                    if (v.paused) {
                      await v.play();
                      setIsPlaying(true);
                    } else {
                      v.pause();
                      setIsPlaying(false);
                    }
                  } catch (error) {
                    console.error('Play error:', error);
                  }
                }}
              >
                {isPlaying ? <Image src="/images/icons/pause.svg" alt="Pause" width={35} height={35} /> : <Image src="/images/icons/play-2.svg" alt="Play" width={35} height={35} />}
              </button>
              <button className="px-3 py-1" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, v.currentTime - 10); }}>
                <Image src="/images/icons/rewind.svg" alt="Rewind" width={50} height={50} />
              </button>
              <button className="px-3 py-1" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.min(duration, v.currentTime + 10); }}>
                <Image src="/images/icons/forward.svg" alt="Forward" width={50} height={50} />
              </button>
              <button
                className="px-3 py-1"
                onClick={() => {
                  const v = videoRef.current;
                  if (v) {
                    v.muted = !v.muted;
                    setIsMuted(v.muted);
                  }
                }}
              >
                {isMuted ? (
                  <Image src="/images/icons/unmuted.svg" alt="Unmuted" width={40} height={40} />
                ) : (
                  <Image src="/images/icons/muted.svg" alt="Muted" width={40} height={40} />
                )}
              </button>
            </div>
            {title && (
              <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold whitespace-nowrap">
                {title}
              </div>
            )}
            {hasNextEpisode && (
              <div className="ml-auto">
                <button className="px-4 py-2" onClick={onNextEpisode}>
                  <Image src="/images/icons/next.svg" alt="Next Episode" width={45} height={45} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
