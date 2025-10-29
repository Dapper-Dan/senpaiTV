'use client';

import { useState, useEffect } from 'react';

export type Provider = 'netflix' | 'hulu' | 'crunchyroll';

export function useProviderAuth() {
  const [linkedProviders, setLinkedProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
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

  console.log('linked', linkedProviders);

  useEffect(() => {
    if (!isLoading) {
      try {
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
      setLinkedProviders(prev => [...prev, provider]);
    }
  };

  const unlinkProvider = (provider: Provider): void => {
    setLinkedProviders(prev => prev.filter(p => p !== provider));
  };

  return {
    linkedProviders,
    isLoading,
    isProviderLinked,
    linkProvider,
    unlinkProvider
  };
}
