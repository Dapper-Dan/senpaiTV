import Image from "next/image";
import styles from "./tile.module.css";

export default function Tile({ image }: { image: string }) {
  return (
    <div className={styles.tile}>
      <Image src={image} alt="Solo Leveling Hero" width={400} height={400} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>  
  );
}
