import { db } from "graphql/db";
import type { QueryResolvers } from "./../../../types.generated";

export const getRecipe: NonNullable<QueryResolvers["getRecipe"]> = async (_parent, args) => {
  await db.read();

  if (!db.data) {
    throw new Error("Database not found");
  }

  const recipes = db.data.recipes.filter(
    (recipe) => recipe.slug.toLowerCase() === args.slug.toLowerCase(),
  );

  if (recipes.length < 1) {
    throw new Error("No matching recipes");
  }

  return recipes[0];
};