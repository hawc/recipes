import { addRecipe } from "@/schema/base/resolvers/Mutation/addRecipe";
import { deleteRecipe } from "@/schema/base/resolvers/Mutation/deleteRecipe";
import { editRecipe } from "@/schema/base/resolvers/Mutation/editRecipe";
import { getRecipe } from "@/schema/base/resolvers/Query/getRecipe";
import { getRecipes } from "@/schema/base/resolvers/Query/getRecipes";

const resolvers = {
  Query: {
    info: () => "Die Kochbuch-API",
    Recipes: getRecipes,
    Recipe: getRecipe,
  },
  Mutation: {
    deleteRecipe,
    addRecipe,
    editRecipe,
  },
};

export { resolvers };
