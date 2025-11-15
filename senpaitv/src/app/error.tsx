'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-[50vw]">
        <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded bg-white/10 border border-[#fefefe] hover:bg-white/20 transition"
          >
            Try again
          </button>
          <Link href="/" className="px-4 py-2 rounded border border-[#fefefe] hover:bg-white/10 transition">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
