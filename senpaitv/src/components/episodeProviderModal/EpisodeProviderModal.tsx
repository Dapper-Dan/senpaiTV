'use client';

import { useState } from 'react';
import { Provider, useProviderAuth } from '@/hooks/useProviderAuth';
import LoginModal from '../loginModal/LoginModal';
import styles from './episodeProviderModal.module.css';

interface EpisodeProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodeTitle: string;
  episodeNumber: number;
  externalLinks: any[];
}

export default function EpisodeProviderModal({
  isOpen,
  onClose,
  episodeTitle,
  episodeNumber,
  externalLinks
}: EpisodeProviderModalProps) {
  const { isProviderLinked, linkProvider } = useProviderAuth();
  const [loginModalProvider, setLoginModalProvider] = useState<Provider | null>(null);

  const availableProviders = externalLinks
    .filter(link => ['Netflix', 'Hulu', 'Crunchyroll'].includes(link.site))
    .map(link => link.site);

  const handleProviderClick = (provider: Provider) => {
    if (isProviderLinked(provider)) {
      onClose();
    } else {
      setLoginModalProvider(provider);
    }
  };

  const handleLoginSuccess = () => {
    if (loginModalProvider) {
      linkProvider(loginModalProvider);
      setLoginModalProvider(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-5"
        onClick={onClose}
      >
        <div 
          className={styles.modalContainer + " rounded-xl w-full max-w-xl p-6 shadow-2xl"}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-2 text-center flex flex-col">
            Watch Episode {episodeNumber}
            <span className="text-md text-xl">{episodeTitle}</span>
          </h2>
          
          <p className="mb-6 text-center text-sm">
            Choose a platform to continue
          </p>
          {availableProviders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {availableProviders.map(provider => {
                const isLinked = isProviderLinked(provider.toLowerCase() as Provider);
                const providerName = provider;
                console.log(providerName, isLinked);
                
                const getProviderInfo = (provider: string) => {
                  switch (provider) {
                    case 'Hulu':
                      return {
                        logo: "/images/icons/hulu-logo.png",
                        subscription: 'Subscription required'
                      };
                    case 'Netflix':
                      return {
                        logo: "/images/icons/netflix-logo.png",
                        subscription: 'Subscription required'
                      };
                    case 'Crunchyroll':
                      return {
                        logo: "/images/icons/cr-logo.png",
                        subscription: 'Subscription required'
                      };
                    default:
                      return {
                        logo: "/images/icons/cr-logo.png",
                        subscription: 'Subscription required'
                      };
                  }
                };
                
                const providerInfo = getProviderInfo(provider);
                
                return (
                  <button
                    key={provider}
                    onClick={() => handleProviderClick(provider.toLowerCase() as Provider)}
                    className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg hover:bg-gray-500"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-sm">
                        <img src={providerInfo.logo} alt={providerName} width={32} height={32} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{providerName}</div>
                        <div className="text-sm">{isLinked ? 'Subscribed' : providerInfo.subscription}</div>
                      </div>
                    </div>
                    
                    <div className="">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p>No streaming providers available</p>
          )}
          <button 
            onClick={onClose}
            className="w-full mt-6 p-3 bg-zinc-700 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>

      {loginModalProvider && (
        <LoginModal
          provider={loginModalProvider}
          isOpen={true}
          onClose={() => setLoginModalProvider(null)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
