import { getAllUndeletedRecipes } from "@/utils/getAllUndeletedRecipes";
import { db } from "graphql/db";
import type { QueryResolvers } from "./../../../types.generated";

export async function getRecipesData() {
  await db.read();

  console.log("db.data", db.data);

  if (!db.data) {
    throw new Error("Database not found");
  }

  console.log("getAllUndeletedRecipes(db.data)", getAllUndeletedRecipes(db.data));

  return getAllUndeletedRecipes(db.data);
}

export const getRecipes: NonNullable<QueryResolvers["getRecipes"]> = async () => {
  return getRecipesData();
};