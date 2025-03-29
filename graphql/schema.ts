import { gql } from "graphql-request";

const typeDefinitions = gql`
  type Query {
    info: String!
    Recipe(slug: String): Recipe!
    Recipes: [Recipe]!
  }

  type Ingredient {
    name: String!
    amount: Int!
    unit: String!
  }

  input IngredientInput {
    name: String!
    amount: Int!
    unit: String!
  }

  input ImageInput {
    name: String!
    src: String
    type: String!
    size: Int!
    width: Int!
    height: Int!
  }

  type Image {
    name: String!
    width: Int!
    height: Int!
    type: String!
    size: Int!
  }

  type Mutation {
    addIngredient(name: String!): [Ingredient]!
    deleteRecipe(id: Int!): [Recipe]!
    addRecipe(
      name: String!
      categories: [String]!
      ingredients: [IngredientInput]!
      servings: Int!
      description: String!
      images: [ImageInput]!
      source: String!
    ): [Recipe]!
    editRecipe(
      slug: String!
      name: String!
      categories: [String]!
      ingredients: [IngredientInput]!
      servings: Int!
      description: String!
      images: [ImageInput]!
      source: String!
    ): [Recipe]!
  }

  type Recipe {
    id: Int!
    name: String!
    slug: String!
    categories: [String]!
    ingredients: [Ingredient]!
    servings: Int!
    description: String
    images: [Image]!
    source: String
  }

  type RecipeIngredient {
    id: Int!
    ingredient: Ingredient!
    amount: Int!
    unit: Unit!
    isAbsolute: Boolean!
  }

  type Unit {
    id: Int!
    name: String!
  }
`;

export { typeDefinitions };
