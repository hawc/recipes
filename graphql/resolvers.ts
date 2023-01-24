import { db } from './db';
import { writeFileSync, existsSync } from 'fs';
import slugify from 'slugify';
import { Ingredient, Receipe } from 'types/receipe';

function generateId(type: string): number {
  return db.data[type].length;
}

interface UploadImage {
  name: string;
  type: string;
  size: string;
  height: string;
  width: string;
  src: string;
}

interface UploadReceipe {
  id: number;
  name: string;
  slug: string;
  categories: string[];
  ingredients: Ingredient[];
  servings: number;
  description: string;
  images: UploadImage[];
  source: string;
}

function getAllUndeletedReceipes(): Receipe[] {
  return db.data.receipes.filter((receipe) => !receipe.deleted);
}

function writeFileToDisc(image: UploadImage): void {
  const ext = image.src.substring(
    image.src.indexOf(`/`) + 1,
    image.src.indexOf(`;base64`),
  );
  const fileType = image.src.substring(`data:`.length, image.src.indexOf(`/`));
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, `gi`);
  const base64Data = image.src.replace(regex, ``);

  writeFileSync(`public/uploads/${image.name}`, base64Data, `base64`);
}

const resolvers = {
  Query: {
    info: () => `Die Kochbuch-API`,
    Receipes: () => {
      return getAllUndeletedReceipes();
    },
    Receipe: (_parent: unknown, args: { slug: string }) => {
      const receipes = db.data.receipes.filter(
        (receipe) => receipe.slug.toLowerCase() === args.slug.toLowerCase(),
      );

      if (receipes.length < 1) {
        throw new Error(`no matching receipes`);
      } else {
        return receipes[0];
      }
    },
  },
  Mutation: {
    deleteReceipe: async (_parent: unknown, args: { id: number }) => {
      await db.read();

      const filteredReceipe = db.data.receipes.find(
        (receipe) => receipe.id === args.id,
      );
      if (filteredReceipe) {
        filteredReceipe.deleted = true;
      } else {
        console.log(`ID ${args.id} not found. Couldn't delete`);
      }

      db.write();

      return getAllUndeletedReceipes();
    },
    addReceipe: async (
      _parent: unknown,
      args: UploadReceipe,
    ): Promise<Receipe[]> => {
      await db.read();
      for (const image of args.images) {
        const fileExists = existsSync(`public/uploads/${image.name}`);
        if (!fileExists) {
          writeFileToDisc(image);
        }
      }

      const slug = slugify(args.name, {
        replacement: `-`,
        strict: true,
        locale: `de`,
      }).toLocaleLowerCase(`de`);

      const receipe: Receipe = {
        id: generateId(`receipes`),
        deleted: false,
        name: args.name,
        slug: slug,
        categories: args.categories,
        ingredients: args.ingredients,
        servings: args.servings,
        description: args.description,
        images: args.images.map((image) => {
          return {
            name: image.name,
            width: image.width,
            height: image.height,
            type: image.type,
            size: image.size,
          };
        }),
        source: args.source,
      };

      db.data.receipes.push(receipe);
      db.write();

      return db.data.receipes;
    },
  },
};

export { resolvers };
