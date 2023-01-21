import { gql } from 'graphql-request';

const typeDefinitions = gql`
  type Query {
    info: String!
  }

  type Mutation {
    addCategory(name: String!): [Category]!
    addImage(name: String!): [Image]!
    addIngredient(name: String!): [Ingredient]!
    addReceipe(
      name: String!
      slug: String!
      categories: [Int]!
      ingredients: [Int]!
      servings: Int!
      description: String!
      images: [Int]!
      source: String!
    ): [Receipe]!
    addReceipeIngredient(name: String!): [ReceipeIngredient]!
    addUnit(name: String!): [Unit]!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Image {
    id: ID!
    name: String!
    src: String!
  }

  type Ingredient {
    id: ID!
    name: String!
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
