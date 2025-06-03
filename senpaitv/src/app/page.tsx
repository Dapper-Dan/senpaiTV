import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-[32px]">
        <div className={styles.homeBanner}>
          <Image src={"/images/solo_leveling_hero3.jpeg"} alt="Solo Leveling Hero" width={1000} height={1000} style={{ width: "100%", height: "100%" }} />
        </div>
        <p>
          SenpaiTV is a platform for watching anime.
        </p>
      </main>
    </div>
  );
}
