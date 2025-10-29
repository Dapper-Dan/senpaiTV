'use client';

import { useState } from 'react';
import { Provider } from '@/hooks/useProviderAuth';
import styles from './loginModal.module.css';

interface LoginModalProps {
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ provider, isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    //DOC: Simulate fake login delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    //DOC:Any email/password combination "works" for demo
    if (email && password) {
      onSuccess();
      onClose();
      setEmail('');
      setPassword('');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-5"
      onClick={handleClose}
    >
      <div
        className={styles.modalContainer + " rounded-xl w-full max-w-xl p-6 shadow-2xl"}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-2xl font-bold">Login to {providerName}</h2>

        <p className="text-center text-sm mt-3">
          Connect your {providerName} account to unlock content
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-zinc-700 border border-white/10 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-zinc-700 border border-white/10 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-60"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-zinc-700 hover:bg-gray-500 rounded-lg px-4 py-3 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gray-700 hover:bg-gray-500 font-semibold rounded-lg px-4 py-3 disabled:opacity-60"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs italic mt-4">
          Demo: Any email/password combination will work
        </p>
      </div>
    </div>
  );
}
