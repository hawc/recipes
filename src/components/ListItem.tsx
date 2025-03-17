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
import type { Receipe } from "types/receipe";
import {
  Desktop, Mobile,
} from "./responsive";

const QUERY_DELETE_RECEIPE = gql`
  mutation deleteReceipe($id: Int!) {
    deleteReceipe(id: $id) {
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
  post: Receipe;
  isFiltered: boolean;
  setSelectedReceipe: (receipe: Receipe | null) => void;
  selectedReceipes: Receipe[];
  setSelectedReceipes: (receipes: Receipe[]) => void;
}

export function ListItem({
  session,
  post,
  isFiltered,
  setSelectedReceipe,
  selectedReceipes,
  setSelectedReceipes,
}: ListItemProps) {
  const {
    mutate, 
  } = useSWRConfig();

  function isInSelectedReceipes(receipe: Receipe): boolean {
    const isInSelectedReceipes = selectedReceipes.find(
      (selectedReceipe) => selectedReceipe.id === receipe.id,
    );

    return new Boolean(isInSelectedReceipes).valueOf();
  }

  function addToList(receipe: Receipe): void {
    if (isInSelectedReceipes(receipe)) {
      setSelectedReceipes(
        selectedReceipes.filter(
          (selectedReceipe) => selectedReceipe.id !== receipe.id,
        ),
      );
    } else {
      setSelectedReceipes([...selectedReceipes, receipe]);
    }
  }

  async function deleteReceipe(id?: number): Promise<void> {
    if (!id) {
      return;
    }
    const client = getClient();

    const receipes: { deleteReceipe: Receipe[] } = await client.request(
      QUERY_DELETE_RECEIPE,
      { id },
    );
    mutate("/");

    console.log(receipes);
    // todo: refetch
  }

  return (
    <div key={post.id}>
      <Desktop>
        <div
          onMouseEnter={() =>
            post.images.length > 0 && setSelectedReceipe(post)
          }
          onMouseLeave={() => setSelectedReceipe(null)}
          onBlur={() => setSelectedReceipe(null)}
          className={`is-flex is-font-size-1-2 ${
            isFiltered ? "" : "opacity-40"
          }`}
        >
          <Link
            onFocus={() => post.images.length > 0 && setSelectedReceipe(post)}
            onBlur={() => setSelectedReceipe(null)}
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
                onClick={() => deleteReceipe(post.id)}
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
              {isInSelectedReceipes(post) ? (
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
          className={`is-font-size-1-2 is-flex receipeListItem ${
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
                onClick={() => deleteReceipe(post.id)}
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
              {isInSelectedReceipes(post) ? (
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
