"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import { useMemo } from "react";
import { Recipe } from "types/recipe";

const REQUIRED_FIELDS: (keyof Recipe)[] = [
  "name",
  "servings",
  "description",
  "source",
  "ingredients",
  "categories",
];

function validateProps(recipe: Partial<Recipe>) {
  return REQUIRED_FIELDS.every((fieldName) => {
    const field = recipe[fieldName];
    if (!field || (Array.isArray(field) && field.length === 0)) {
      return false;
    }
    
    return true;
  });
}

export function SubmitRecipe() {
  const {
    recipe,
    addRecipe,
    updateRecipe,
  } = useRecipeContext();
  const isValid = useMemo(() => recipe && validateProps(recipe), [recipe]);

  function handleSubmit() {
    if (!recipe || !validateProps(recipe)) {
      return;
    }

    if (recipe.id) {
      updateRecipe(recipe);

      return;
    }

    addRecipe(recipe);
  }

  return (
    <>
      <button
        type="button"
        disabled={!isValid}
        onClick={handleSubmit}
        className="button is-primary"
      >
        Rezept speichern
      </button>
      {isValid ? (
        <p className="mt-2">
          <span className="tag is-success is-light">
            Rezept kann hochgeladen werden.
          </span>
        </p>
      ) : (
        <p className="mt-2">
          <span className="tag is-danger is-light">
            Es sind noch nicht alle Felder gefüllt.
          </span>
        </p>
      )}
    </>
  );
}