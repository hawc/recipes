import { db } from './db';
import { writeFileSync, existsSync } from 'fs';

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
  },
  Mutation: {
    addReceipe: async (_parent: unknown, args: any) => {
      const imageNames = [];
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
          imageNames.push(image.name);
        } else {
          imageNames.push(image.name);
        }
      }

      const receipe = {
        id: generateId(`receipes`),
        name: args.name,
        slug: args.slug,
        categories: args.categories,
        ingredients: args.ingredients,
        servings: args.servings,
        description: args.description,
        images: imageNames,
        source: args.source,
      };

      db.data.receipes.push(receipe);
      db.write();

      return db.data.receipes;
    },
  },
};

export { resolvers };
