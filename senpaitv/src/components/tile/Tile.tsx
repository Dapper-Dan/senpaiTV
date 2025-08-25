import Image from "next/image";
import styles from "./tile.module.css";

export default function Tile({ image, title, genres }: { image: string, title: string, genres: any }) {
  return (
    <div className={styles.tile}>
      <Image className={styles.image} src={image} alt={title} width={280} height={420} />
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.genres}>
        {genres.slice(0, 3).map((genre: string) => (
          <li key={genre} className={styles.genreItem}>
            {genre}
          </li>
        ))}
      </ul>
    </div>  
  );
}
