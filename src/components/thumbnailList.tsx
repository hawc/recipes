import { Thumbnail } from './thumbnail';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Receipe } from 'types/receipe';

export function ThumbnailList({
  receipes,
  filteredReceipes,
}: {
  receipes: Receipe[];
  filteredReceipes: number[];
}): JSX.Element {
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
              className={`box is-relative thumbnailWrapper ${
                filteredReceipes.includes(receipe.id) ? `` : `opacity-40`
              }`}
            >
              <Thumbnail image={receipe.images[0]} />
              <div className="thumbnailDescription">{receipe.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
