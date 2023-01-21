import { Receipe, Ingredient } from 'types/receipe';
import { db } from './db';

function generateId(type) {
  return db.data[type].length;
}

const resolvers = {
  Query: {
    info: () => `Die Kochbuch-API`,
  },
  Mutation: {
    addIngredient: (parent: unknown, args: Ingredient) => {
      const ingredient = {
        id: generateId(`receipes`),
        name: args.name,
      };

      db.data.ingredients.push(ingredient);
      db.write();

      return db.data.receipes;
    },
    addReceipe: (parent: unknown, args: Receipe) => {
      const receipe = {
        id: generateId(`receipes`),
        name: args.name,
        slug: args.slug,
        categories: args.categories,
        ingredients: args.ingredients,
        servings: args.servings,
        description: args.description,
        images: args.images,
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
