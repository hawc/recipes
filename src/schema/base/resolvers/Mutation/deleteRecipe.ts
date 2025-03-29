import { revalidate } from "@/lib/revalidate";
import { getAllUndeletedRecipes } from "@/utils/getAllUndeletedRecipes";
import { db } from "graphql/db";
import type { MutationResolvers } from "./../../../types.generated";

export const deleteRecipe: NonNullable<MutationResolvers["deleteRecipe"]> = async (parent, args) => {
  await db.read();

  if (!db.data) {
    throw new Error("Database not found");
  }

  const filteredRecipe = db.data.recipes.find(
    (recipe) => recipe.id === args.id,
  );
  if (filteredRecipe) {
    filteredRecipe.deleted = true;
  } else {
    console.log(`ID ${args.id} not found. Couldn't delete`);
  }

  await db.write();

  await revalidate("/");

  return getAllUndeletedRecipes(db.data);
};