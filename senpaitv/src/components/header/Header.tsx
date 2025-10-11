'use client';
import Link from "next/link"
import Searchbar from "../Searchbar";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import styles from "./header.module.css";

export default function Header() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-gray-400">
          <Link href="/">Browse</Link>
        </li>
        <li className="hover:text-gray-400">
          <Link href="/watchlist">My List</Link>
        </li>
      </ul>
      <Searchbar />

      <div className="rounded-full bg-gray w-10 h-10 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-100 cursor-pointer"
        >
          <Image src={user?.image || "/images/senpai_logo.png"} className="profile-icon" alt="profile icon" width={50} height={50} />
        </button>
        <div
          className={`dropdown ${styles.dropdown} ${isOpen ? "flex flex-col" : "hidden"}`}
          ref={dropdownRef}
        >
          {isAuthenticated ? (
            <>
              <button className="text-3xl flex items-center gap-3 cursor-pointer">
                <Image src={user?.image || "/images/senpai_logo.png"} className="profile-icon rounded-full" alt="profile icon" width={50} height={50} />
                {user?.name || user?.email}
                <img src={"/images/icons/edit.svg"} alt="Edit" width={25} height={25} />
              </button>
              <Link href="/watchlist" className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer">
                <img src={"/images/icons/favorite.svg"} alt="Watchlist" width={40} height={40} />
                Watchlist
              </Link>
              <button
                onClick={() => signOut()}
                className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer"
              >
                <img src={"/images/icons/logout.svg"} alt="Sign Out" className={styles.logoutIcon} width={40} height={40} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="hover:bg-gray-600 text-xl flex items-center gap-3 cursor-pointer">
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
