import { Ingredient } from "types/receipe";

export function mergeIngredientLists(ingredientArrays: Ingredient[][]): Ingredient[] {
  let finalList: Ingredient[] = [];

  if (ingredientArrays.length > 0) {
    ingredientArrays.forEach((ingredientArray) => {
      finalList = [...finalList, ...ingredientArray];
    });
  }
  finalList.sort((a, b) => a.name.localeCompare(b.name));

  return finalList;
}