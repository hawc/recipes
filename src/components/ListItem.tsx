"use client";

import { SessionData } from "@auth0/nextjs-auth0/types";
import {
  PencilIcon,
  ShoppingCartIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { gql } from "graphql-request";
import { getClient } from "graphql/client";
import Link from "next/link";
import { useSWRConfig } from "swr";
import type { Recipe } from "types/recipe";
import {
  Desktop, Mobile,
} from "./responsive";

const QUERY_DELETE_RECIPE = gql`
  mutation deleteRecipe($id: Int!) {
    deleteRecipe(id: $id) {
      id
      categories
      name
      slug
      ingredients {
        name
        amount
        unit
      }
      images {
        name
        width
        height
      }
    }
  }
`;

interface ListItemProps {
  session: SessionData | null;
  post: Recipe;
  isFiltered: boolean;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  selectedRecipes: Recipe[];
  setSelectedRecipes: (recipes: Recipe[]) => void;
}

export function ListItem({
  session,
  post,
  isFiltered,
  setSelectedRecipe,
  selectedRecipes,
  setSelectedRecipes,
}: ListItemProps) {
  const {
    mutate, 
  } = useSWRConfig();

  function isInSelectedRecipes(recipe: Recipe): boolean {
    const isInSelectedRecipes = selectedRecipes.find(
      (selectedRecipe) => selectedRecipe.id === recipe.id,
    );

    return new Boolean(isInSelectedRecipes).valueOf();
  }

  function addToList(recipe: Recipe): void {
    if (isInSelectedRecipes(recipe)) {
      setSelectedRecipes(
        selectedRecipes.filter(
          (selectedRecipe) => selectedRecipe.id !== recipe.id,
        ),
      );
    } else {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  }

  async function deleteRecipe(): Promise<void> {
    if (!post.id) {
      return;
    }
    
    const client = getClient();

    const recipes: { deleteRecipe: Recipe[] } = await client.request(
      QUERY_DELETE_RECIPE,
      { id: post.id },
    );
    await mutate("/");

    console.log(recipes);
    // todo: refetch
  }

  return (
    <div key={post.id}>
      <Desktop>
        <div
          onMouseEnter={() =>
            post.images.length > 0 && setSelectedRecipe(post)
          }
          onMouseLeave={() => setSelectedRecipe(null)}
          onBlur={() => setSelectedRecipe(null)}
          className={`is-flex is-font-size-1-2 ${
            isFiltered ? "" : "opacity-40"
          }`}
        >
          <Link
            onFocus={() => post.images.length > 0 && setSelectedRecipe(post)}
            onBlur={() => setSelectedRecipe(null)}
            className="has-text-black is-flex-basis-100 mb-1"
            href={`/rezept/${post.slug}`}
          >
            {post.name}
          </Link>
          {session && (
            <>
              <Link
                className="button is-white is-small"
                href={`/rezept/bearbeiten/${post.slug}`}
              >
                <span className="icon is-medium">
                  <PencilIcon />
                </span>
              </Link>
              <button
                title="Rezept löschen"
                type="button"
                className="button is-white is-small"
                onClick={void deleteRecipe}
              >
                <span className="icon is-medium">
                  <TrashIcon />
                </span>
              </button>
            </>
          )}
          <button
            type="button"
            className="button is-white is-small"
            onClick={() => addToList(post)}
          >
            <span className="icon is-medium">
              {isInSelectedRecipes(post) ? (
                <XMarkIcon />
              ) : (
                <ShoppingCartIcon />
              )}
            </span>
          </button>
        </div>
      </Desktop>
      <Mobile>
        <div
          className={`is-font-size-1-2 is-flex recipeListItem ${
            isFiltered ? "" : "opacity-40"
          }`}
        >
          <Link
            className="has-text-black is-flex-basis-100 mb-2"
            href={`/rezept/${post.slug}`}
          >
            {post.name}
          </Link>
          {session && (
            <>
              <Link
                className="button is-white is-small"
                href={`/rezept/bearbeiten/${post.slug}`}
              >
                <span className="icon is-medium">
                  <PencilIcon />
                </span>
              </Link>
              <button
                title="Rezept löschen"
                type="button"
                className="button is-white is-small"
                onClick={void deleteRecipe}
              >
                <span className="icon is-medium">
                  <TrashIcon />
                </span>
              </button>
            </>
          )}
          <button
            title="zur Einkaufsliste hinzufügen"
            type="button"
            className="button is-white is-small"
            onClick={() => addToList(post)}
          >
            <span className="icon is-medium">
              {isInSelectedRecipes(post) ? (
                <XMarkIcon />
              ) : (
                <ShoppingCartIcon />
              )}
            </span>
          </button>
        </div>
      </Mobile>
    </div>
  );
}
