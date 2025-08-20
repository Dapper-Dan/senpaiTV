import Image from "next/image";
import styles from "./tile.module.css";

export default function Tile({ image, title }: { image: string, title: string }) {
  return (
    <div className={styles.tile}>
      <Image className={styles.image} src={image} alt={title} width={280} height={420} />
    </div>  
  );
}
