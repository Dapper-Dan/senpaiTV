import Link from "next/link"
import Searchbar from "./Searchbar";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center gap-6 px-8 py-4 bg-light-black">
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
        <Image src={"/images/senpai_logo.png"} className="profile-icon" alt="profile icon" width={50} height={50}/>
      </div>
    </header>
  );  
}
