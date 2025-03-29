import { Recipe } from "types/recipe";

export function getRecipeIds(recipes: Recipe[]): string[] {
  return recipes.map((recipe) => recipe.id);
}
