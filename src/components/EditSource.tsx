"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import { useState } from "react";

export function EditSource() {
  const {
    recipe, 
    setRecipe,
  } = useRecipeContext();
  const source = recipe?.source ?? "";
  const [currentSource, setCurrentSource] = useState<string>(source);

  function setSource(source: string) {
    setCurrentSource(source);
    setRecipe({
      ...recipe,
      source,
    });
  }
  
  return (
    <>
      Quelle:{" "}
      <input
        type="text"
        name="source"
        className="input input-faux is-fullwidth ml-3"
        placeholder="https://..."
        value={currentSource}
        onChange={(event) => setSource(event.currentTarget.value)}
      />
    </>
  );
}