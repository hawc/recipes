"use client";

import { getRecipeIds } from "@/utils/getRecipeIds";
import { mergeIngredientLists } from "@/utils/mergeIngredientLists";
import { SessionData } from "@auth0/nextjs-auth0/types";
import {
  ListBulletIcon, PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  useMemo, useState,
} from "react";
import type {
  Ingredient, Recipe,
} from "types/recipe";
import { BuyList } from "./BuyList";
import { ImageThumbnailList } from "./ImageThumbnailList";
import { ListItem } from "./ListItem";
import { PreviewImage } from "./PreviewImage";
import { Desktop } from "./responsive";

interface RecipesListProps {
  categories: string[];
  recipes: Recipe[];
  session: SessionData | null;
}

export function RecipesList({
  categories, recipes, session, 
}: RecipesListProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<string[]>(( )=> getRecipeIds(recipes));
  const [viewThumbnails, setViewThumbnails] = useState(true);

  const buyList = useMemo(() => {
    const arr = mergeIngredientLists([...selectedRecipes].map((recipe) => recipe.ingredients));
    const res = Array.from(
      arr
        .reduce((acc, {
          amount, ...r 
        }) => {
          const key = JSON.stringify(r);
          const current = acc.get(key) as Ingredient || { 
            ...r,
            amount: 0,
          } as Ingredient;

          return acc.set(key, {
            ...current,
            amount: current.amount + amount,
          });
        }, new Map())
        .values(),
    );

    return res as Ingredient[];
  }, [selectedRecipes]);

  function optionsChangeHandler(selectedOption: string): void {
    let filteredPostdata = recipes;
    if (selectedOption !== "") {
      filteredPostdata = recipes.filter((recipe) => recipe.categories.includes(selectedOption));
    }

    setFilteredRecipes(filteredPostdata.map((post) => post.id));
  }

  return (
    <>
      <h2 className="title is-3 is-size-4-mobile is-flex mb-3 mt-2 is-align-items-center">
        <div className="mr-4 is-flex-grow-1-mobile">Rezepte</div>
        <div className="select is-inline-block is-size-6 is-rounded mr-2">
          <select aria-label="Kategorie auswählen" onChange={(event) => optionsChangeHandler(event.currentTarget?.value)}>
            <option value="">Alle</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button title="Rezept löschen" type="button" className="button is-white" onClick={() => setViewThumbnails(!viewThumbnails)}>
            <span className="icon is-medium">{!viewThumbnails ? <PhotoIcon /> : <ListBulletIcon />}</span>
          </button>
        </div>
      </h2>
      {(viewThumbnails ? (
        <ImageThumbnailList recipes={recipes} filteredRecipes={filteredRecipes} />
      ) : (
        <div className="columns">
          <div className="column">
            {recipes.map((recipe: Recipe) => (
              <ListItem
                key={recipe.id}
                session={session}
                isFiltered={!!recipe.id && filteredRecipes.includes(recipe.id)}
                post={recipe}
                selectedRecipes={selectedRecipes}
                setSelectedRecipes={setSelectedRecipes}
                setSelectedRecipe={setSelectedRecipe}
              />
            ))}
            {buyList.length > 0 && <BuyList buyList={buyList} />}
          </div>
          <Desktop>
            <div className="column">
              {selectedRecipe && (
                <PreviewImage slug={selectedRecipe.slug} image={selectedRecipe.images[0]} />
              )}
            </div>
          </Desktop>
        </div>
      ))}
    </>
  );
}