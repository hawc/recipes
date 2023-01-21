import {
  Category,
  Image,
  Ingredient,
  Receipe,
  ReceipeIngredient,
  Unit,
} from './receipe';

interface Data {
  categories: Category[];
  images: Image[];
  ingredients: Ingredient[];
  receipes: Receipe[];
  receipeIngredients: ReceipeIngredient[];
  units: Unit[];
}

export type { Data };
