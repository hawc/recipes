import Link from "next/link";
import { Recipe } from "types/recipe";
import { ImageThumbnail } from "./ImageThumbnail";
import styles from "./ImageThumbnailList.module.scss";

interface ImageThumbnailListProps {
  recipes: Recipe[];
  filteredRecipes: string[];
}

export function ImageThumbnailList({
  recipes,
  filteredRecipes,
}: ImageThumbnailListProps) {
  return (
    <div>
      <div className="columns is-variable is-2 is-mobile is-multiline mt-3">
        {recipes.map((recipe: Recipe) => (
          <div
            className="column is-one-third-widescreen is-one-quarter-tablet is-half-mobile py-3"
            key={recipe.name}
          >
            <Link
              href={`/rezept/${recipe.slug}`}
              className={`box is-relative ${styles.thumbnailWrapper} ${recipe.id && filteredRecipes.includes(recipe.id) ? "" : "opacity-40"
              }`}
            >
              <ImageThumbnail image={recipe.images[0]} />
              <div className="thumbnailDescription">{recipe.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
