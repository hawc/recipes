"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import { useState } from "react";

export function EditName() {
  const {
    recipe, 
    setRecipe,
  } = useRecipeContext();
  const name = recipe?.name ?? "";

  const [currentName, setCurrentName] = useState<string>(name);

  function setName(name: string) {
    setCurrentName(name);
    setRecipe({
      ...recipe,
      name,
    });
  }
  
  return (
    <input
      placeholder="Rezeptname"
      type="text"
      className="input input-faux is-fullwidth title is-2 is-size-3-mobile mb-1 mt-2"
      name="name"
      value={currentName}
      onChange={(event) => {
        setName(event.target.value);
      }}
    />
  );
}