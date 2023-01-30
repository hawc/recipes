import { Thumbnail } from './thumbnail';
import Link from 'next/link';

export function ThumbnailList({ receipes }): JSX.Element {
  return (
    <div>
      <div className="columns is-variable is-2 is-mobile is-multiline mt-3">
        {receipes.map((receipe) => (
          <div
            className="column is-one-quarter-tablet is-half-mobile py-2
          "
            key={receipe.name}
          >
            <Link
              href={`/rezept/${receipe.slug}`}
              className="box is-relative thumbnailWrapper"
            >
              {receipe.images[0] && <Thumbnail receipe={receipe} />}
              <div className="thumbnailDescription">{receipe.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
