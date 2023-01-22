import { gql } from 'graphql-request';

const typeDefinitions = gql`
  type Query {
    info: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Ingredient {
    id: ID!
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
    src: String!
    type: String!
    size: Int!
  }

  type Image {
    id: ID!
    name: String!
    src: String!
    type: String!
    size: String!
  }

  type Mutation {
    addCategory(name: String!): [Category]!
    addImage(name: String!): [Image]!
    addIngredient(name: String!): [Ingredient]!
    addReceipe(
      name: String!
      slug: String!
      categories: [String]!
      ingredients: [IngredientInput]!
      servings: Int!
      description: String!
      images: [ImageInput]!
      source: String!
    ): [Receipe]!
    addReceipeIngredient(name: String!): [ReceipeIngredient]!
    addUnit(name: String!): [Unit]!
  }

  type Receipe {
    id: ID!
    name: String!
    slug: String!
    categories: [Category]!
    ingredients: [ReceipeIngredient]!
    servings: Int!
    description: String
    images: Image
    source: String
  }

  type ReceipeIngredient {
    id: ID!
    ingredient: Ingredient!
    amount: Int!
    unit: Unit!
    isAbsolute: Boolean!
  }

  type Unit {
    id: ID!
    name: String!
  }
`;

export { typeDefinitions };
