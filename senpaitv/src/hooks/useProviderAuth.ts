'use client';

import { useState, useEffect } from 'react';

export type Provider = 'netflix' | 'hulu' | 'crunchyroll';

export function useProviderAuth() {
  const [linkedProviders, setLinkedProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('senpaitv-linked-providers');
      if (stored) {
        const providers = JSON.parse(stored) as Provider[];
        setLinkedProviders(providers);
      }
    } catch (error) {
      console.error('Error loading provider auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        if (typeof window === 'undefined') return;
        localStorage.setItem('senpaitv-linked-providers', JSON.stringify(linkedProviders));
      } catch (error) {
        console.error('Error saving provider auth state:', error);
      }
    }
  }, [linkedProviders, isLoading]);

  const isProviderLinked = (provider: Provider): boolean => {
    return linkedProviders.includes(provider);
  };

  const linkProvider = (provider: Provider): void => {
    if (!linkedProviders.includes(provider)) {
      const next = [...linkedProviders, provider];
      setLinkedProviders(next);

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('senpaitv-linked-providers', JSON.stringify(next));
        }
      } catch (error) {
        console.error('Error persisting provider link:', error);
      }
    }
  };

  const unlinkProvider = (provider: Provider): void => {
    const next = linkedProviders.filter(p => p !== provider);
    setLinkedProviders(next);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('senpaitv-linked-providers', JSON.stringify(next));
      }
    } catch (error) {
      console.error('Error persisting provider unlink:', error);
    }
  };

  return {
    linkedProviders,
    isLoading,
    isProviderLinked,
    linkProvider,
    unlinkProvider
  };
}
