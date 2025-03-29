import Image from "next/image";
import Link from "next/link";
import type { Image as ImageType } from "types/recipe";

export function PreviewImage({
  slug, image, 
}: { slug: string,
  image: ImageType }) {
  return (
    <div>
      <Link href={`/rezept/${slug}`}>
        <Image
          src={`/uploads/${image.name ?? "/uploads/blank.png"}`}
          className="box p-0 max-width-100"
          alt="Rezeptvorschau"
          width={image.width}
          height={image.height}
        />
      </Link>
    </div>
  );
}