"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import {
  MinusIcon, PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export function EditServings() {
  const {
    recipe,
    setRecipe,
  } = useRecipeContext();
  const servings = recipe?.servings ?? 1;
  const [currentServings, setCurrentServings] = useState<number>(servings);

  function setServings(servings: number) {
    if (servings !== currentServings) {
      setCurrentServings(servings);
      setRecipe({
        ...recipe,
        servings,
      });
    }
  }

  return (
    <>
      <div className="field-label is-normal is-flex-grow-0 mr-3 mb-0 pt-0">
        <div className="control">Portionen:</div>
      </div>
      <div className="field-body is-flex">
        <div className="control">
          <button
            title="Portion entfernen"
            className="button is-white px-2"
            type="button"
            disabled={servings <= 1}
            onClick={() => {
              if (servings > 1) {
                setServings(servings - 1);
              }
            }}
          >
            <span className="icon">
              <MinusIcon />
            </span>
          </button>
        </div>
        <div className="control">
          <input
            className="input is-static is-width-40px has-text-centered has-text-weight-bold	hide-spin-buttons"
            type="number"
            value={currentServings}
            min="1"
            placeholder="Portionen"
            name="servings"
            onChange={(event) =>
              setServings(parseInt(event.target.value))
            }
          />
        </div>
        <div className="control">
          <button
            title="Portion hinzufügen"
            className="button is-white px-2"
            type="button"
            onClick={() => setServings(servings + 1)}
          >
            <span className="icon">
              <PlusIcon />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}