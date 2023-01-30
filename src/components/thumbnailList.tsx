import { Thumbnail } from './thumbnail';
import Link from 'next/link';
import { Receipe } from 'types/receipe';

export function ThumbnailList({
  receipes,
  filteredReceipes,
}: {
  receipes: Receipe[];
  filteredReceipes: Receipe[];
}): JSX.Element {
  return (
    <div>
      <div className="columns is-variable is-2 is-mobile is-multiline mt-3">
        {receipes.map((receipe: Receipe) => (
          <div
            className="column is-one-quarter-tablet is-half-mobile py-2
          "
            key={receipe.name}
          >
            <Link
              href={`/rezept/${receipe.slug}`}
              className={`box is-relative thumbnailWrapper ${
                filteredReceipes
                  .map((filtered) => filtered.name)
                  .includes(receipe.name)
                  ? ``
                  : `opacity-40`
              }`}
            >
              <Thumbnail receipe={receipe} />
              <div className="thumbnailDescription">{receipe.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
