"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import {
  PlusIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import styles from "./Categories.module.scss";
import { NewCategory } from "./NewCategory";

export function EditCategories() {
  const {
    recipe, 
  } = useRecipeContext();
  const categories = recipe?.categories ?? [];

  const [currentCategories, setCurrentCategories] = useState<string[]>(categories);

  function addCategory(category) {
    if (category && !categories.includes(category)) {
      setCurrentCategories([...categories, category]);
      // todo: save in db
    }
  }

  function removeCategory(category: string) {
    if (category) {
      setCurrentCategories([...categories.filter((existingCategories) => existingCategories !== category)]);
      // todo: save in db
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
        <button
          type="button"
          className="button is-small is-primary ml-1 py-0 is-height-5 is-va-baseline"
        >
          <span className="icon is-medium">
            <PlusIcon onClick={addCategory} />
          </span>
        </button>
      </li>
    </ul>
  );
}
