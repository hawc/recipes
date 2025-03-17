import { revalidate } from "@/lib/revalidate";
import {
  existsSync, writeFileSync,
} from "fs";
import path from "path";
import slugify from "slugify";
import { Data } from "types/model";
import {
  Ingredient, Receipe,
} from "types/receipe";
import { db } from "./db";

function trimListNames(list) {
  list.map((element) => (element.name = element.name.trim()));

  return list;
}

function trimList(list) {
  list.map((element) => (element = element.trim()));

  return list;
}

function generateId(type: string): number {
  return db.data?.[type].length;
}

export interface UploadImage {
  name: string;
  type: string;
  size: number;
  height: number;
  width: number;
  src?: string;
}

export interface UploadReceipe {
  id: number;
  name: string;
  slug: string;
  categories: string[];
  ingredients: Ingredient[];
  servings: number | string;
  description: string;
  images: UploadImage[];
  source: string;
}

function getAllUndeletedReceipes(data: Data): Receipe[] {
  return data.receipes.filter((receipe) => !receipe.deleted);
}

const imageDirectory = path.join(process.cwd(), "uploads");

function writeFileToDisc(image: UploadImage): void {
  if (!image.src) {
    console.warn("No file src found.");

    return;
  }

  const ext = image.src.substring(
    image.src.indexOf("/") + 1,
    image.src.indexOf(";base64"),
  );
  const fileType = image.src.substring("data:".length, image.src.indexOf("/"));
  const regex = new RegExp(`^data:${fileType}/${ext};base64,`, "gi");
  const base64Data = image.src.replace(regex, "");

  writeFileSync(`${imageDirectory}/${image.name}`, base64Data, "base64");
}

const resolvers = {
  Query: {
    info: () => "Die Kochbuch-API",
    Receipes: async () => {
      await db.read();

      if (!db.data) {
        return;
      }

      return getAllUndeletedReceipes(db.data);
    },
    Receipe: async (_parent: unknown, args: { slug: string }) => {
      await db.read();

      if (!db.data) {
        return;
      }

      const receipes = db.data.receipes.filter(
        (receipe) => receipe.slug.toLowerCase() === args.slug.toLowerCase(),
      );

      if (receipes.length < 1) {
        throw new Error("no matching receipes");
      } else {
        return receipes[0];
      }
    },
  },
  Mutation: {
    deleteReceipe: async (_parent: unknown, args: { id: number }) => {
      await db.read();

      if (!db.data) {
        return;
      }

      const filteredReceipe = db.data.receipes.find(
        (receipe) => receipe.id === args.id,
      );
      if (filteredReceipe) {
        filteredReceipe.deleted = true;
      } else {
        console.log(`ID ${args.id} not found. Couldn't delete`);
      }

      db.write();

      revalidate("/");

      return getAllUndeletedReceipes(db.data);
    },
    addReceipe: async (
      _parent: unknown,
      args: UploadReceipe,
    ): Promise<Receipe[]> => {
      await db.read();

      for (const image of args.images) {
        const fileExists = existsSync(`${imageDirectory}/${image.name}`);
        if (!fileExists) {
          writeFileToDisc(image);
        }
      }

      const slug = slugify(args.name, {
        replacement: "-",
        strict: true,
        locale: "de",
      }).toLocaleLowerCase("de");

      const receipe: Receipe = {
        id: generateId("receipes"),
        deleted: false,
        name: args.name.trim(),
        slug: slug,
        categories: trimList(args.categories),
        ingredients: trimListNames(args.ingredients),
        servings: args.servings as number,
        description: args.description.trim(),
        images: args.images.map((image) => {
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

      db.data?.receipes.push(receipe);
      db.write();

      revalidate("/");

      return db.data?.receipes ?? [];
    },
    editReceipe: async (
      _parent: unknown,
      args: UploadReceipe,
    ): Promise<Receipe[]> => {
      await db.read();
      for (const image of args.images) {
        const fileExists = existsSync(`${imageDirectory}/${image.name}`);
        if (!fileExists && image.src) {
          writeFileToDisc(image);
        }
      }

      const editedReceipe = db.data?.receipes.find(
        (receipe) => receipe.slug === args.slug,
      );

      if (editedReceipe) {
        const slug = slugify(args.name.trim(), {
          replacement: "-",
          strict: true,
          locale: "de",
        }).toLocaleLowerCase("de");

        const receipe: Receipe = {
          id: editedReceipe.id,
          deleted: false,
          name: args.name.trim(),
          slug: slug,
          categories: trimList(args.categories),
          ingredients: trimListNames(args.ingredients),
          servings: args.servings as number,
          description: args.description.trim(),
          images: args.images.map((image: UploadImage) => {
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

        if (!db.data) {
          return [];
        }

        db.data.receipes[db.data.receipes.indexOf(editedReceipe)] = receipe;

        db.write();

        revalidate("/");
        revalidate(`/rezept/${slug}`);
        revalidate(`/rezept/bearbeiten/${slug}`);
      }

      return db.data?.receipes ?? [];
    },
  },
};

export { resolvers };
