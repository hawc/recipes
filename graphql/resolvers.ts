import { db } from './db';
import { writeFileSync, existsSync } from 'fs';
import slugify from 'slugify';

function generateId(type) {
  return db.data[type].length;
}

// interface UploadImage {
//   name: string;
//   type: string;
//   size: string;
//   src: string;
// }

// interface UploadReceipe {
//   id: string;
//   name: string;
//   slug: string;
//   categories: string;
//   ingredients: string;
//   servings: string;
//   description: string;
//   images: UploadImage[];
//   source: string;
// }

const resolvers = {
  Query: {
    info: () => `Die Kochbuch-API`,
    Receipes: () => {
      return db.data.receipes;
    },
    Receipe: (_parent: unknown, args: any) => {
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
    addReceipe: async (_parent: unknown, args: any) => {
      for (const image of args.images) {
        console.log(`image`);
        console.log(image);
        const fileExists = existsSync(`public/uploads/${image.name}`);
        if (!fileExists) {
          const ext = image.src.substring(
            image.src.indexOf(`/`) + 1,
            image.src.indexOf(`;base64`),
          );
          const fileType = image.src.substring(
            `data:`.length,
            image.src.indexOf(`/`),
          );
          const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, `gi`);
          const base64Data = image.src.replace(regex, ``);

          writeFileSync(`public/uploads/${image.name}`, base64Data, `base64`);
        }
      }

      const slug = slugify(args.name, {
        replacement: `-`,
        strict: true,
        locale: `de`,
      }).toLocaleLowerCase(`de`);

      const receipe = {
        id: generateId(`receipes`),
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
