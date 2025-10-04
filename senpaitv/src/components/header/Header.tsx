'use client';
import Link from "next/link"
import Searchbar from "../Searchbar";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import styles from "./header.module.css";

export default function Header() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center gap-6 px-8 py-2 bg-light-black">
      <Image src={"/images/senpai_logo.png"} className="profile-icon" alt="senpaitv logo" width={50} height={50}/>
      <h1 className="text-3xl font-bold">SenpaiTV</h1>
      <ul className="flex gap-4">
        <li className="text-gray">
          <Link href="/">Home</Link>
        </li>
        <li className="text-gray">
          <Link href="/">Browse</Link>
        </li>
        <li className="text-gray">
          <Link href="/">My List</Link>
        </li>
      </ul>
      <Searchbar />

      <div className="rounded-full bg-gray w-10 h-10 overflow-hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-100"
        >
          <Image src={user?.image || "/images/senpai_logo.png"} className="profile-icon" alt="profile icon" width={50} height={50}/>
        </button>
        <div className={`dropdown ${styles.dropdown} ${isOpen ? "flex flex-col" : "hidden"}`}>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-300">
                {user?.name || user?.email}
              </span>
              <button 
                onClick={() => signOut()}
                className="hover:bg-gray-600"
              >
          </button>
            </>
          ) : (
            <>
              <Link href="/">Profile</Link>
              <Link href="/">Settings</Link>
              <button onClick={() => signIn()}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </header>
  );  
}
