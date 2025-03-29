import { revalidate } from "@/lib/revalidate";
import { trimList } from "@/utils/trimList";
import { trimListNames } from "@/utils/trimListNames";
import {
  imageDirectory, writeFileToDisc,
} from "@/utils/writeFileToDisc";
import { db } from "graphql/db";
import { existsSync } from "node:fs";
import slugify from "slugify";
import { Ingredient } from "types/recipe";
import type {
  ImageInput, MutationResolvers,
} from "./../../../types.generated";

export const editRecipe: NonNullable<MutationResolvers["editRecipe"]> = async (parent, args) => {
  await db.read();

  if (!db.data) {
    throw new Error("Database not found");
  }

  for (const image of args.images) {
    if (image) {
      const fileExists = existsSync(`${imageDirectory}/${image.name}`);
      if (!fileExists && image.src) {
        writeFileToDisc(image);
      }
    }
  }

  const editedRecipe = db.data.recipes.find(
    (recipe) => recipe.id === args.id,
  );

  if (editedRecipe) {
    const slug = slugify(args.name.trim(), {
      replacement: "-",
      strict: true,
      locale: "de",
    }).toLocaleLowerCase("de");

    const recipe = {
      id: editedRecipe.id,
      deleted: false,
      name: args.name.trim(),
      slug: slug,
      categories: trimList(args.categories as string[]),
      ingredients: trimListNames<Ingredient[]>(args.ingredients as Ingredient[]),
      servings: args.servings,
      description: args.description.trim(),
      images: args.images.map((image: ImageInput) => {
        return {
          name: image.name,
          width: image.width,
          height: image.height,
          type: image.type,
          size: image.size,
        };
      }),
      source: args.source.trim(),
    };

    const index = db.data.recipes.indexOf(editedRecipe);
    
    if (index && db.data.recipes[index]) {
      db.data.recipes[index] = recipe;
    }

    await db.write();

    await revalidate("/");
    await revalidate(`/rezept/${slug}`);
    await revalidate(`/rezept/bearbeiten/${slug}`);
  }

  return db.data.recipes;
};