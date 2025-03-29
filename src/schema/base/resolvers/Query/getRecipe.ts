import { db } from "graphql/db";
import type { QueryResolvers } from "./../../../types.generated";

export async function getRecipeData(slug: string) {
  await db.read();

  if (!db.data) {
    throw new Error("Database not found");
  }

  const recipes = db.data.recipes.filter(
    (recipe) => recipe.slug.toLowerCase() === slug.toLowerCase(),
  );

  if (recipes.length < 1) {
    throw new Error("No matching recipes");
  }

  return recipes[0];
}

export const getRecipe: NonNullable<QueryResolvers["getRecipe"]> = async (_parent, args) => {
  return getRecipeData(args.slug);
};