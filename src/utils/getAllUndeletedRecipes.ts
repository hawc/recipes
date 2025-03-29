import { Data } from "types/model";
import { Recipe } from "types/recipe";

export function getAllUndeletedRecipes(data: Data): Recipe[] {
  return data.recipes.filter((recipe) => !recipe.deleted);
}