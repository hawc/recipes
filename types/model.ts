import { Ingredient, Receipe, Unit } from './receipe';

interface Data {
  categories: string[];
  images: string[];
  ingredients: Ingredient[];
  receipes: Receipe[];
  units: Unit[];
}

export type { Data };
