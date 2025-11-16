'use client';
import Link from "next/link"
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { getAniListAuthUrl } from "@/lib/aniList/oauth/oauth";
import { syncAniListWithWatchlist } from "@/app/actions/aniList";
import styles from "./header.module.css";
import { useSession } from "next-auth/react";
import { buildUserKey, clearTokensForUser } from "@/lib/aniList/client/userToken";
import { useAniListToken } from "@/lib/aniList/client/useAniListToken";
import AniListConnectModal from "@/components/aniList/AniListConnectModal";
import { emitAniListOk, emitAniListError } from "@/lib/aniList/client/events";

export default function Header() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const { data: session } = useSession();
  const { token, userKey, isConnected } = useAniListToken();
  const [isOpen, setIsOpen] = useState(false);
  const [anilistConnected, setAnilistConnected] = useState(false);
  const [showAniListModal, setShowAniListModal] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnilistConnected(isConnected);
      const params = new URLSearchParams(window.location.search);
      if (params.get('anilist_connected')) {
        setAnilistConnected(true);
      }
    }
  }, [session?.user, isConnected]);

  useEffect(() => {
    let aborted = false;
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (aborted) return;
        setProfileName(data?.user?.name ?? null);
        setProfileImage(data?.user?.image ?? null);
      } catch {}
    }
    if (isAuthenticated) {
      fetchUser();
    } else {
      setProfileName(null);
      setProfileImage(null);
    }
    const onProfileUpdated = () => fetchUser();
    window.addEventListener('profile-updated', onProfileUpdated);
    return () => {
      aborted = true;
      window.removeEventListener('profile-updated', onProfileUpdated);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center gap-6 px-8 py-2 bg-light-black">
      <Image src={"/images/senpai_logo.png"} className="profile-icon" alt="senpaitv logo" width={50} height={50} />
      <h1 className="text-3xl font-bold">SenpaiTV</h1>
      <ul className="flex gap-4">
        <li className="hover:text-gray-400">
          <Link href="/">Browse</Link>
        </li>
        <li className="hover:text-gray-400">
          <Link href="/watchlist">My List</Link>
        </li>
      </ul>
      <Link href="/search" className="ml-auto">
        <img src={"/images/icons/search.svg"} className="cursor-pointer" alt="Search" width={25} height={25} />
      </Link>
      <div className="rounded-full bg-gray w-10 h-10 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-100 cursor-pointer"
        >
          <Image src={profileImage || user?.image || "/images/senpai_logo.png"} className="profile-icon" alt="profile icon" width={50} height={50} />
        </button>
        <div
          className={`dropdown ${styles.dropdown} ${isOpen ? "flex flex-col" : "hidden"}`}
          ref={dropdownRef}
        >
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="text-3xl flex items-center gap-3 cursor-pointer">
                <Image src={profileImage || user?.image || "/images/senpai_logo.png"} className="profile-icon rounded-full" alt="profile icon" width={50} height={50} />
                {profileName || user?.name || user?.email}
                <img src={"/images/icons/edit.svg"} alt="Edit" width={25} height={25} />
              </Link>
              <Link href="/watchlist" className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer">
                <img src={"/images/icons/favorite.svg"} alt="Watchlist" width={40} height={40} />
                Watchlist
              </Link>
              <button
                onClick={() => {
                  try {
                    const key = buildUserKey(session?.user as any);
                    clearTokensForUser(key);
                    localStorage.removeItem('anilist_watchlist_last_sync');
                    setAnilistConnected(false);
                  } catch {}
                  signOut();
                }}
                className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer"
              >
                <img src={"/images/icons/logout.svg"} alt="Sign Out" className={styles.logoutIcon} width={40} height={40} />
                Sign Out
              </button>
              <button
                onClick={() => setShowAniListModal(true)}
                className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer"
              >
                <Image src={"/images/icons/antenna.svg"} alt="AniList" width={40} height={45} />
                {anilistConnected ? 'Anilist: Connected' : 'Anilist: Not Connected'}
              </button>
              <AniListConnectModal
                open={showAniListModal}
                isConnected={anilistConnected}
                onClose={() => setShowAniListModal(false)}
                onConnect={() => {
                  window.location.href = getAniListAuthUrl();
                }}
                onSync={async () => {
                  if (!token) {
                    window.location.href = getAniListAuthUrl();
                    return;
                  }
                  try {
                    await syncAniListWithWatchlist(token);
                    setAnilistConnected(true);
                    emitAniListOk();
                    setShowAniListModal(false);
                  } catch (e) {
                    console.error('Sync failed', e);
                    emitAniListError();
                  }
                }}
              />
            </>
          ) : (
            <>
              <Link href="/register" className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer">
                <img src={"/images/icons/create-account.svg"} alt="Create Account" width={40} height={40} />
                Create Account
              </Link>
              <button
                onClick={() => signIn()}
                className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer"
              >
                <img src={"/images/icons/login.svg"} alt="Sign In" className={styles.loginIcon} width={40} height={40} />
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
