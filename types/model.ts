import {
  Ingredient, Recipe, Unit,
} from "./recipe";

interface Data {
  categories: string[];
  images: string[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  units: Unit[];
}

export type { Data };
