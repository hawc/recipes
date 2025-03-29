import { revalidate } from "@/lib/revalidate";
import { generateId } from "@/utils/generateId";
import { trimList } from "@/utils/trimList";
import { trimListNames } from "@/utils/trimListNames";
import { writeFileToDisc } from "@/utils/writeFileToDisc";
import { db } from "graphql/db";
import { existsSync } from "node:fs";
import path from "path";
import slugify from "slugify";
import {
  Ingredient, Recipe,
} from "types/recipe";
import type { MutationResolvers } from "./../../../types.generated";

const imageDirectory = path.join(process.cwd(), "uploads");

export const addRecipe: NonNullable<MutationResolvers["addRecipe"]> = async (_parent, args) => { 
  await db.read();

  if (!db.data) {
    throw new Error("Database not found");
  }

  for (const image of args.images) {
    if (image) {
      const fileExists = existsSync(`${imageDirectory}/${image.name}`);
      if (!fileExists) {
        writeFileToDisc(image);
      }
    }
  }

  const slug = slugify(args.name, {
    replacement: "-",
    strict: true,
    locale: "de",
  }).toLocaleLowerCase("de");

  const recipe: Recipe = {
    id: generateId(),
    deleted: false,
    name: args.name.trim(),
    slug: slug,
    categories: trimList(args.categories as string[]),
    ingredients: trimListNames<Ingredient[]>(args.ingredients as Ingredient[]),
    servings: args.servings,
    description: args.description.trim(),
    images: args.images.map((image) => {
      if (image) {
        return {
          name: image.name,
          width: image.width,
          height: image.height,
          type: image.type,
          size: image.size,
        };
      }
    }).filter(image => image !== undefined),
    source: args.source.trim(),
  };

  db.data.recipes.push(recipe);
  await db.write();

  await revalidate("/");

  return db.data.recipes;
};