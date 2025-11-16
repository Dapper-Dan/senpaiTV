'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    const finalUsername = username?.trim() || (email.includes('@') ? email.split('@')[0] : email);
    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username: finalUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Registration failed');
        setLoading(false);
        return;
      }
      try { window.dispatchEvent(new CustomEvent('auth-pending', { detail: 'signin' })); } catch {}
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      });
      if (!signInRes) setLoading(false);
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !!email && password.length >= 6 && !loading;

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-14 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-2xl font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-3 text-white placeholder-gray-500"
              placeholder=""
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-3 text-white placeholder-gray-500"
              placeholder=""
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-2xl font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-white py-3 text-white placeholder-gray-500"
              placeholder=""
            />
            <div className="text-gray-400 mt-2">Use at least 6 characters, do not use empty spaces</div>
          </div>
          {error &&
            <div className="text-red-500 text-sm -mt-4">
              {error}
            </div>
          }
          <div className="flex flex-col items-center gap-6">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-lg border border-gray-500 px-6 py-4 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed button-primary"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            <div className="text-gray-300">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => signIn()}
                className="text-gray-400 underline-offset-2"
              >
                Log in
              </button>
            </div>
            <p className="text-center text-gray-400 text-sm leading-relaxed">
              This is a demo site made for fun. Terms and conditions are have a great time!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
