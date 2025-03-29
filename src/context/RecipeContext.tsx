"use client";

import { gql } from "graphql-request";
import { getClient } from "graphql/client";
import router from "next/router";
import {
  createContext, PropsWithChildren,
  useContext, useState,
} from "react";
import slugify from "slugify";
import { mutate } from "swr";
import type { Recipe } from "types/recipe";

function getSlug(name: string) {
  return slugify(
    name.trim(),
    {
      replacement: "-",
      strict: true,
      locale: "de",
    },
  );
}

const EDIT_RECIPE_QUERY = gql`
  mutation editRecipe(
    $slug: String!
    $name: String!
    $categories: [String]!
    $ingredients: [IngredientInput]!
    $servings: Int!
    $description: String!
    $images: [ImageInput]!
    $source: String!
  ) {
    editRecipe(
      slug: $slug
      name: $name
      categories: $categories
      ingredients: $ingredients
      servings: $servings
      description: $description
      images: $images
      source: $source
    ) {
      id
      name
      slug
    }
  }
`;

const ADD_RECIPE_QUERY = gql`
  mutation addRecipe(
    $name: String!
    $categories: [String]!
    $ingredients: [IngredientInput]!
    $servings: Int!
    $description: String!
    $images: [ImageInput]!
    $source: String!
  ) {
    addRecipe(
      name: $name
      categories: $categories
      ingredients: $ingredients
      servings: $servings
      description: $description
      images: $images
      source: $source
    ) {
      id
      name
      slug
    }
  }
`;

interface RecipeContextProps {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
}

export const RecipeContext = createContext({} as RecipeContextProps);

const EMPTY_RECIPE = {
  id: "",
  slug: "",
  name: "",
  categories: [],
  ingredients: [],
  servings: 0,
  description: "",
  images: [],
  source: "",
} as Recipe;

export function RecipeContextProvider({
  recipe: initRecipe,
  children, 
}: PropsWithChildren<{ recipe?: Recipe }>) {
  const [recipe, setRecipe] = useState<Recipe>(initRecipe ?? EMPTY_RECIPE);

  async function addRecipe(recipe: Recipe) {
    if (!recipe) {
      return;
    }

    const client = getClient();
    await client.request(ADD_RECIPE_QUERY, recipe);
    await mutate("/");
    await mutate(`/rezept/${getSlug(recipe.name)}`);
    setRecipe(EMPTY_RECIPE);
    await router.push(`/rezept/${getSlug(recipe.name)}`);
  }

  async function updateRecipe(update: Partial<Recipe>) {
    if (!recipe) {
      return;
    }

    const client = getClient();
    await client
      .request(EDIT_RECIPE_QUERY, {
        ...recipe,
        ...update,
      });
      
    await mutate("/");
    await mutate(`/rezept/${getSlug(recipe.name)}`);

    setRecipe(EMPTY_RECIPE);

    await router.push(`/rezept/${getSlug(recipe.name)}`);
  }

  const value = {
    recipe,
    setRecipe,
    addRecipe,
    updateRecipe,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export const useRecipeContext = () => useContext(RecipeContext);