import { getRecipeData } from "@/schema/base/resolvers/Query/getRecipe";
import { getRecipesData } from "@/schema/base/resolvers/Query/getRecipes";
import { Recipe } from "types/recipe";
import { initDb } from "./db";

export async function getStaticRecipeData(
  args: { slug: string; },
): Promise<Recipe | undefined> {
  initDb();
  const recipe = getRecipeData(args.slug);

  return recipe;
}

export async function getStaticRecipesData() {
  initDb();
  const recipes = await getRecipesData();

  return recipes;
}
