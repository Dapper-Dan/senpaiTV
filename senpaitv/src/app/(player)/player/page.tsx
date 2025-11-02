'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer';
import styles from './player.module.css';

export default function PlayerPage() {
  const params = useSearchParams();
  const router = useRouter();
  const title = params.get('title') || '';
  const src = params.get('src') || '';

  if (!src) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No video source provided.</p>
          <button onClick={() => router.back()} className="px-3 py-2 bg-zinc-700 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <VideoPlayer title={title} src={src} />
    </div>
  );
}
