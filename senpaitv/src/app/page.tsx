import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-[32px]">
        <Image src={"/images/solo_leveling_hero3.jpeg"} className="home-banner" alt="Solo Leveling Hero" width={1000} height={1000} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        <p>
          SenpaiTV is a platform for watching anime.
        </p>
      </main>
    </div>
  );
}
