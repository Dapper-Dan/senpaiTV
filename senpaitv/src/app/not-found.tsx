import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold mb-4">Page not found</h1>
        <p className="mb-10 text-2xl">Sorry senpai, the page you’re looking for wasn't transported to this world.</p>
        <Link href="/" className="px-5 py-3 rounded bg-white/10 border border-[#fefefe] hover:bg-white/20 transition text-xl">
          Go Home
        </Link>
      </div>
    </div>
  );
}
