"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import styles from "./Categories.module.scss";
import { NewCategory } from "./NewCategory";

export function EditCategories() {
  const {
    recipe,
    setRecipe,
  } = useRecipeContext();
  const categories = recipe?.categories ?? [];

  const [currentCategories, setCurrentCategories] = useState<string[]>(categories);

  function addCategory(category: string) {
    if (category && !categories.includes(category)) {
      setCurrentCategories([...categories, category]);
      setRecipe({
        ...recipe,
        categories: currentCategories,
      });
    }
  }

  function removeCategory(category: string) {
    if (category) {
      setCurrentCategories([...categories.filter((existingCategories) => existingCategories !== category)]);
      setRecipe({
        ...recipe,
        categories: currentCategories,
      });
    }
  }

  return (
    <ul className={styles.categories}>
      {currentCategories.map((category) => (
        <li
          className="is-flex is-alignItems-center has-text-black"
          key={category}
        >
          {category}
          <button
            type="button"
            onClick={() => removeCategory(category)}
            className="button is-white ml-1 py-0 px-3 mr-3 is-height-5 is-va-baseline"
          >
            <span className="icon is-medium">
              <XMarkIcon />
            </span>
          </button>
        </li>
      ))}
      <li className="is-flex is-alignItems-center">
        <NewCategory categories={categories} addCategory={addCategory} />
      </li>
    </ul>
  );
}
