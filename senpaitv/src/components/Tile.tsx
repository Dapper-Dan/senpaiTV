import Image from "next/image";

export default function Tile({ image }: { image: string }) {
  return (
    <div className="tile">
      <Image src={image} alt="Solo Leveling Hero" width={400} height={400} />
    </div>  
  );
}
