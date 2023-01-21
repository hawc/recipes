import { db } from './db';
import { writeFile, readFileSync } from 'fs';
import { v4 as uuid } from 'uuid';

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
    addReceipe: (parent: unknown, args: any) => {
      const imageNames = [];
      args.images.forEach((image) => {
        writeFile(`public/uploads/${image.name}`, image.src, (error) => {
          if (error) console.log(error);
          else {
            imageNames.push(image.name);
          }
        });
      });

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

      console.log(receipe);
      db.data.receipes.push(receipe);
      db.write();

      return db.data.receipes;
    },
  },
};

export { resolvers };
