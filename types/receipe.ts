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

interface ReceipeIngredient {
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

interface Receipe {
  id?: number;
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

interface Receipes {
  receipes: Receipe[];
}

export type { Image, Ingredient, Receipe, ReceipeIngredient, Receipes, Unit };

