import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-light-black pt-8 px-[100px] flex flex-col">
      <div className="container flex gap-20">
        <div className="container flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-4">
            <Image src="/images/senpai_logo.png" alt="SenpaiTV" width={70} height={70} />
            <h1 className="text-4xl font-bold">SenpaiTV</h1>
          </div>
          <div className="flex items-center text-gray-400 gap-4">
            <p className="text-sm">
              <span className="font-bold">SenpaiTV</span> is a conceptual demo of an all-in-one anime platform for streaming, tracking, and discovery. All data is sourced from external APIs for demo use only.
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold pt-4">Developer Links</h3>
          <ul className="flex flex-col gap-3 pt-4">
            <li>
              <Link className="text-gray-400 hover:text-foreground" href="https://github.com/Dapper-Dan" target="_blank">GitHub</Link>
            </li>
            <li>
              <Link className="text-gray-400 hover:text-foreground" href="https://www.linkedin.com/in/daniel-r-lancaster/" target="_blank">LinkedIn</Link>
            </li>
            <li>
              <Link className="text-gray-400 hover:text-foreground" href="" target="_blank">Portfolio</Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold pt-4">Internal Links</h3>
          <ul className="flex flex-col gap-3 pt-4">
            <li>
              <Link className="text-gray-400 hover:text-foreground" href="/">Home</Link>
            </li>
            <li>
              <Link className="text-gray-400 hover:text-foreground" href="/watchlist">My List</Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold pt-4">Contact</h3>
          <ul className="flex flex-col gap-3 pt-4">
            <li>
              <Link className="text-gray-400 hover:text-foreground" href="mailto:daniel.ray.lancaster@gmail.com">Email</Link>
            </li>
          </ul>
        </div>
        <div className="ml-auto pt-4">
          <div className="text-gray-400 text-lg flex items-center">
            <span className="mr-2">Made with love</span>
            <Image src="/images/love-japan.png" alt="Love Japan Image" width={40} height={40} />
          </div>
          <span className="text-gray-400 text-lg">I hope you enjoy using SenpaiTV!</span>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm pt-20">
        <p>
          Built with <span className="text-foreground">Next.js</span> · <span className="text-foreground">TypeScript</span> · <span className="text-foreground">Anilist API</span>
        </p>  
        <p>
          © 2025 Daniel Lancaster. Not affiliated with Anilist, Crunchyroll, or any anime streaming service.
        </p>
      </div>
    </footer>
  );
}
