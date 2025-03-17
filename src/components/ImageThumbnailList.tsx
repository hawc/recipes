import Link from "next/link";
import { Receipe } from "types/receipe";
import { ImageThumbnail } from "./ImageThumbnail";
import styles from "./ImageThumbnailList.module.scss";

interface ImageThumbnailListProps {
  receipes: Receipe[];
  filteredReceipes: number[];
}

export function ImageThumbnailList({
  receipes,
  filteredReceipes,
}: ImageThumbnailListProps) {
  return (
    <div>
      <div className="columns is-variable is-2 is-mobile is-multiline mt-3">
        {receipes.map((receipe: Receipe) => (
          <div
            className="column is-one-third-widescreen is-one-quarter-tablet is-half-mobile py-3"
            key={receipe.name}
          >
            <Link
              href={`/rezept/${receipe.slug}`}
              className={`box is-relative ${styles.thumbnailWrapper} ${receipe.id && filteredReceipes.includes(receipe.id) ? "" : "opacity-40"
              }`}
            >
              <ImageThumbnail image={receipe.images[0]} />
              <div className="thumbnailDescription">{receipe.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
