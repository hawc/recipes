import { Recipe } from "types/recipe";
import { initDb } from "./db";
import { resolvers } from "./resolvers";

export async function getStaticData(
  type: string,
  args?: { slug: string; },
): Promise<Recipe | Recipe[] | undefined> {
  initDb();
  if (type === "recipe") {
    if (!args) {
      return [];
    }
    const recipe = await resolvers.Query.Recipe(null, args);

    return recipe;
  }
  if (type === "recipes") {
    const recipes = await resolvers.Query.Recipes();

    return recipes;
  }

  return;
}
