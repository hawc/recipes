"use client";

import { useBuyListContext } from "@/context/BuyListContext";
import {
  EyeIcon, EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Ingredient } from "types/recipe";

interface IngredientListProps {
  list: Ingredient[];
  servings?: number;
  recipeServings?: number;
}

export function IngredientList({
  list,
  servings, 
  recipeServings,
}: IngredientListProps) {
  const [strikedRows, setStrikedRows] = useState<string[]>([]);
  const {
    exportList,
  } = useBuyListContext();

  function strikeRow(ingredientID: string): void {
    const rows = [...strikedRows];
    if (!strikedRows.includes(ingredientID)) {
      rows.push(ingredientID);
    } else {
      rows.splice(strikedRows.indexOf(ingredientID), 1);
    }
    setStrikedRows(rows);
  }

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Menge</th>
          <th>Zutat</th>
          <th></th>
        </tr>
      </thead>
      <tbody ref={exportList}>
        {list.map((ingredient) => (
          <tr
            data-name={`${ingredient.name}-${ingredient.unit}`}
            key={`${ingredient.name}-${ingredient.unit}`}
            data-striked={strikedRows.includes(`${ingredient.name}-${ingredient.unit}`)}
            className={
              strikedRows.includes(`${ingredient.name}-${ingredient.unit}`)
                ? "is-line-through"
                : ""
            }
          >
            <td>
              {recipeServings && servings ? (ingredient.amount / recipeServings) * (servings ?? recipeServings) : ingredient.amount}
              {" "}
              {ingredient.unit !== "Stück" && ingredient.unit}
            </td>
            <td>{ingredient.name}</td>
            <td className="is-width-0 py-1">
              <div className="is-flex is-justify-content-end">
                <button
                  type="button"
                  title="Zutat streichen"
                  className="button button-strike is-small is-white"
                  onClick={() =>
                    strikeRow(`${ingredient.name}-${ingredient.unit}`)
                  }
                >
                  <span className="icon is-medium">
                    {strikedRows.includes(`${ingredient.name}-${ingredient.unit}`) ? <EyeIcon /> : <EyeSlashIcon />}
                  </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
