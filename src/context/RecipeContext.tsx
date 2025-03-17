"use client";

import { gql } from "graphql-request";
import { getClient } from "graphql/client";
import router from "next/router";
import {
  createContext, PropsWithChildren, useContext, useState,
} from "react";
import slugify from "slugify";
import { mutate } from "swr";
import type { Receipe } from "types/receipe";

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
  mutation editReceipe(
    $slug: String!
    $name: String!
    $categories: [String]!
    $ingredients: [IngredientInput]!
    $servings: Int!
    $description: String!
    $images: [ImageInput]!
    $source: String!
  ) {
    editReceipe(
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
  mutation addReceipe(
    $name: String!
    $categories: [String]!
    $ingredients: [IngredientInput]!
    $servings: Int!
    $description: String!
    $images: [ImageInput]!
    $source: String!
  ) {
    addReceipe(
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
  recipe: Receipe;
  setRecipe: (recipe: Receipe) => void;
  addRecipe: (recipe: Receipe) => void;
  updateRecipe: (recipe: Receipe) => void;
}

export const RecipeContext = createContext({} as RecipeContextProps);

const EMPTY_RECIPE: Receipe = {
  id: undefined,
  name: "",
  slug: "",
  categories: [],
  ingredients: [],
  servings: 0,
  description: "",
  images: [],
  source: "",
};

export function RecipeContextProvider({
  recipe: initRecipe,
  children, 
}: PropsWithChildren<{ recipe?: Receipe }>) {
  const [recipe, setRecipe] = useState<Receipe>(initRecipe ?? EMPTY_RECIPE);

  function addRecipe(recipe) {
    if (!recipe) {
      return;
    }

    const client = getClient();
    client
      .request(ADD_RECIPE_QUERY, recipe)
      .then(() => {
        mutate("/");
        mutate(`/rezept/${getSlug(recipe.name)}`);
        setRecipe(EMPTY_RECIPE);
      })
      .finally(() => {
        router.push(`/rezept/${getSlug(recipe.name)}`);
      });
  }

  function updateRecipe(update: Partial<Receipe>) {
    if (!recipe) {
      return;
    }

    const client = getClient();
    client
      .request(EDIT_RECIPE_QUERY, {
        ...recipe,
        ...update,
      })
      .then(() => {
        mutate("/");
        mutate(`/rezept/${getSlug(recipe.name)}`);
      })
      // .then(() => {
      //   setName("");
      //   setDescription("");
      //   setSource("");
      //   setServings(2);
      //   setCategories([]);
      //   setImages([]);
      //   setIngredientList([]);
      // })
      .finally(() => {
        router.push(`/rezept/${getSlug(recipe.name)}`);
      });
  }

  const value = {
    recipe,
    setRecipe,
    addRecipe,
    updateRecipe,
  };

  console.log(recipe);

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export const useRecipeContext = () => useContext(RecipeContext);