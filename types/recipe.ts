// interface Category {
//   id: number;
//   name: string;
// }

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Unit {
  id: number;
  name: string;
}

interface RecipeIngredient {
  id: number;
  ingredient: number;
  amount: number;
  unit: Unit;
  isAbsolute: boolean;
}

interface Image {
  name: string;
  type: string;
  width: number;
  height: number;
  size?: number;
  src?: string;
}

interface Recipe {
  id: string;
  deleted?: boolean;
  name: string;
  slug: string;
  categories: string[];
  ingredients: Ingredient[];
  servings: number;
  description: string;
  images: Image[];
  source: string;
}

interface Recipes {
  recipes: Recipe[];
}

export type { Image, Ingredient, Recipe, RecipeIngredient, Recipes, Unit };

