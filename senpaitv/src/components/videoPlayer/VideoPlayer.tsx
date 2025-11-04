'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  title?: string;
  src: string;
  introSkipToSeconds?: number;
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
}

export default function VideoPlayer({ title, src, introSkipToSeconds = 90, onNextEpisode, hasNextEpisode = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
        <div className="absolute bottom-0 left-0 right-0 p-4">
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
          <div className="flex items-center justify-center gap-3">
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
              <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, v.currentTime - 10); }}>-10s</button>
              <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.min(duration, v.currentTime + 10); }}>+10s</button>
              {/* <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20" onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.min(duration, introSkipToSeconds); }}>Skip Intro</button> */}
            </div>
            <div className="flex">
              {title && (
                <div className="text-center text-lg font-semibold">{title}</div>
              )}
            </div>
            <button className="px-4 py-2" onClick={onNextEpisode}>
              <Image src="/images/icons/next.svg" alt="Next Episode" width={35} height={35} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
