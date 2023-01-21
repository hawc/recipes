interface Category {
  id: number;
  name: string;
}

interface Ingredient {
  id: number;
  name: string;
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
  id: number;
  name: string;
  src: string;
}

interface Receipe {
  id: string;
  name: string;
  slug: string;
  categories: number[];
  ingredients: number[];
  servings: number;
  description: string;
  images: number[];
  source: string;
}

interface Receipes {
  receipes: Receipe[];
}

export type {
  Category,
  Ingredient,
  Image,
  Receipe,
  ReceipeIngredient,
  Receipes,
  Unit,
};
