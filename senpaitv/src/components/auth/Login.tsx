'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function Login() {
  const { status } = useSession();
  const params = useSearchParams();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      setShowToast(true);
      const cb = params.get('callbackUrl') || '/';
      const t = setTimeout(() => {
        router.replace(cb);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [status, params, router]);

  async function handleCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      try { window.dispatchEvent(new CustomEvent('auth-pending', { detail: 'signin' })); } catch {}
      const res = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      });
      if (!res) {
        setLoading(false);
      }
    } catch {
      setError('Sign in failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-10">
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold">
            Sign in to SenpaiTV
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Access your personalized anime library
          </p>
        </div>
        <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-2xl font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-3 text-white placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-3 text-white placeholder-gray-500"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full rounded-lg border border-gray-500 px-6 py-4 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed button-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-2 space-y-6 justify-center flex">
          <button
            onClick={() => {
              try { window.dispatchEvent(new CustomEvent('auth-pending', { detail: 'signin' })); } catch {}
              signIn('google');
            }}
            className="hover:bg-gray-600 flex items-center justify-center p-4 border border-[#fefefe] rounded-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
      {showToast && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-700 text-white text-sm text-center py-2 font-bold">
          Signed in successfully, redirecting...
        </div>
      )}
    </div>
  );
}
