"use client";

import { useRecipeContext } from "@/context/RecipeContext";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { arrayMoveImmutable } from "array-move";
import {
  useRef, useState,
} from "react";
import { Ingredient } from "types/recipe";

const UNITS = ["Stück", "ml", "l", "g", "kg", "TL", "EL", "Prise(n)"];

export function EditIngredientList() {
  const {
    recipe,
    setRecipe,
  } = useRecipeContext();
  const list = recipe?.ingredients ?? [];
  const [ingredientList, setIngredientList] = useState<Ingredient[]>(list);
  const [ingredientAmount, setIngredientAmount] = useState<string>("");
  const [ingredientUnit, setIngredientUnit] = useState<string>("");
  const [ingredientName, setIngredientName] = useState<string>("");
  const ingredients = useRef(null);

  function addIngredient(): void {
    const ingredient = {
      amount: parseInt(ingredientAmount),
      unit: ingredientUnit,
      name: ingredientName,
    };

    if (ingredient.amount && ingredient.unit && ingredient.name) {
      if (
        !ingredientList.includes(ingredient) &&
        !ingredientList.map((ing) => ing.name).includes(ingredient.name)
      ) {
        setIngredientList([...ingredientList, ingredient]);
        setIngredientAmount("");
        setIngredientUnit("");
        setIngredientName("");
        setRecipe({
          ...recipe,
          ingredients: ingredientList,
        });
      }
    }
  }

  function removeIngredient(ingredient: Ingredient): void {
    if (ingredient) {
      const newIngredients = [
        ...ingredientList.filter(
          (ingredientFromList) => ingredientFromList !== ingredient,
        ),
      ];
      setIngredientList(newIngredients);
      setRecipe({
        ...recipe,
        ingredients: newIngredients,
      });
    }
  }

  function moveIngredient(ingredient: Ingredient, direction: number): void {
    if (ingredient) {
      const pos = ingredientList.indexOf(ingredient);
      const newList = arrayMoveImmutable(ingredientList, pos, pos + direction);
      setIngredientList(newList);
      setRecipe({
        ...recipe,
        ingredients: newList,
      });
    }
  }

  function moveIngredientUp(ingredient: Ingredient) {
    moveIngredient(ingredient, -1);
  }

  function moveIngredientDown(ingredient: Ingredient) {
    moveIngredient(ingredient, 1);
  }

  const disabled = !ingredientAmount ||
    !ingredientUnit ||
    !ingredientName ||
    ingredientList.map((ingredient) => ingredient.name).includes(ingredientName);

  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Menge</th>
          <th>Zutat</th>
          <th></th>
        </tr>
      </thead>
      <tbody ref={ingredients}>
        {ingredientList.map((ingredient, index) => (
          <tr
            data-name={`${ingredient.name}-${ingredient.unit}`}
            key={`${ingredient.name}-${ingredient.unit}`}
          >
            <td>
              {ingredient.amount}
              {" "}
              {ingredient.unit !== "Stück" && ingredient.unit}
            </td>
            <td>{ingredient.name}</td>
            <td className="is-width-0 py-1">
              <div className="is-flex is-justify-content-end">
                {index !== 0 && (
                  <button
                    type="button"
                    className="button button-strike is-small is-white"
                    onClick={() => moveIngredientUp(ingredient)}
                  >
                    <span className="icon is-medium">
                      <ArrowUpIcon />
                    </span>
                  </button>
                )}
                {index !== list.length - 1 && (
                  <button
                    type="button"
                    className="button button-strike is-small is-white"
                    onClick={() => moveIngredientDown(ingredient)}
                  >
                    <span className="icon is-medium">
                      <ArrowDownIcon />
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  className="button button-strike is-small is-white"
                  onClick={() => removeIngredient(ingredient)}
                >
                  <span className="icon is-medium">
                    <XMarkIcon />
                  </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
        <tr
          onKeyUp={(event) => {
            event.preventDefault();
            if (event.key === "Enter") {
              addIngredient();
            }
          }}
        >
          <td className="td-input-select">
            <input
              className="hide-spin-buttons input input-faux py-0"
              type="number"
              placeholder="1000"
              value={ingredientAmount}
              onChange={(event) =>
                setIngredientAmount(event.currentTarget.value)
              }
            />
            <div className="input-faux select">
              <select
                className="input-faux py-0"
                value={ingredientUnit}
                onChange={(event) =>
                  setIngredientUnit(event.currentTarget.value)
                }
              >
                <option value="">Einheit</option>
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </td>
          <td className="td-input" colSpan={2}>
            <div className="is-flex">
              <input
                className="input input-faux hide-spin-buttons py-0"
                type="text"
                placeholder="Zutat"
                value={ingredientName}
                onChange={(event) =>
                  setIngredientName(event.currentTarget.value)
                }
              />
              <button
                type="button"
                title="Zutat hinzufügen"
                className="button is-small is-height-5 is-primary"
                disabled={disabled}
                onClick={() => {
                  addIngredient();
                }}
              >
                <span className="icon is-medium">
                  <PlusIcon />
                </span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}