"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import {
  useEffect, useRef, useState,
} from "react";

export function EditDescription() {
  const {
    recipe, 
    setRecipe,
  } = useRecipeContext();
  const description = recipe?.description ?? "";
  const [currentDescription, setCurrentDescription] = useState<string>(description);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.setProperty(
        "height",
        `${descriptionRef.current.scrollHeight}px`,
        "important",
      );
    }
  }, [currentDescription, descriptionRef]);

  function setDescription(description) {
    setCurrentDescription(description);
    setRecipe({
      ...recipe,
      description,
    });
  }

  return (
    <div className="field">
      <div className="control">
        <textarea
          ref={descriptionRef}
          name="description"
          className="textarea input-faux"
          placeholder="Beschreibung"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
      </div>
    </div>
  );
}