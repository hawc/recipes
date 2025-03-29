/* eslint-disable @next/next/no-img-element */
import { Categories } from "@/components/Categories";
import { PortionedIngredients } from "@/components/PortionedIngredients";
import {
  Desktop, Mobile,
} from "@/components/responsive";
import { ShareIngredients } from "@/components/ShareIngredients";
import { BuyListContextProvider } from "@/context/BuyListContext";
import { RecipeContextProvider } from "@/context/RecipeContext";
import { auth0 } from "@/lib/auth0";
import { PencilIcon } from "@heroicons/react/24/outline";
import { gql } from "graphql-request";
import { getStaticData } from "graphql/build";
import { getClient } from "graphql/client";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "types/recipe";

const QUERY_RECIPES = gql`
  query Recipes {
    Recipes {
      name
      slug
    }
  }
`;

export async function generateStaticParams() {
  const client = getClient();
  const {
    Recipes, 
  }: {
    Recipes: Recipe[];
  } = await client.request(QUERY_RECIPES);

  return Recipes.map((recipe: Recipe) => ({
    slug: recipe.slug,
  }));
}

interface RecipeProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({
  params, 
}: RecipeProps) {
  const slug = (await params).slug;

  const recipe = (await getStaticData("recipe", {
    slug,
  })) as Recipe;

  const session = await auth0.getSession();

  return (
    <RecipeContextProvider recipe={recipe}>
      <BuyListContextProvider>
        <section className="section pt-5">
          <div className="container is-max-widescreen">
            <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">
              <span className="pr-2">{recipe.name}</span>
              {session && (
                <>
                  <Link
                    className="button is-white is-vcentered"
                    href={`/rezept/bearbeiten/${recipe.slug}`}
                  >
                    <span className="icon is-medium">
                      <PencilIcon />
                    </span>
                  </Link>
                </>
              )}
            </h2>
            <Categories categories={recipe.categories} />
            {recipe.images?.length > 0 && (
              <Mobile>
                <div className="block px-0 pb-2">
                  <img
                    className="box p-0"
                    src={`/uploads/${
                      recipe.images[0].name ?? "/uploads/blank.png"
                    }`}
                    alt="Rezeptbild"
                    width={recipe.images[0].width}
                    height={recipe.images[0].height}
                  />
                </div>
              </Mobile>
            )}
            {recipe.ingredients?.length > 0 && (
              <>
                <h3 className="title is-3 is-size-4-mobile mb-3">
                  Zutaten
                  <ShareIngredients />
                </h3>
                <div className="block mb-5 pb-2">
                  <div className="columns">
                    <div className="column is-4 is-relative">
                      <div className="t-5 is-sticky">
                        <PortionedIngredients recipe={recipe} />
                      </div>
                    </div>
                    {recipe.images?.length > 0 && (
                      <Desktop>
                        <div className="column pl-5 is-relative">
                          <Image
                            className="box p-0 t-5 is-sticky"
                            src={`/uploads/${
                              recipe.images[0].name ?? "/uploads/blank.png"
                            }`}
                            alt="Rezeptbild"
                            width={recipe.images[0].width}
                            height={recipe.images[0].height}
                          />
                        </div>
                      </Desktop>
                    )}
                  </div>
                </div>
              </>
            )}
            <h3 className="title is-3 is-size-4-mobile">Zubereitung</h3>
            <div className="content is-white-space-pre-line">
              {recipe.description}
            </div>
            {recipe.source?.length && (
              <div className="block pt-2 is-overflow-wrap-anywhere">
                Quelle:{" "}
                <a
                  className="has-text-black"
                  target="_blank"
                  rel="noreferrer noopener"
                  href={recipe.source}
                >
                  {" "}
                  {recipe.source}
                </a>
              </div>
            )}
          </div>
        </section>
      </BuyListContextProvider>
    </RecipeContextProvider>
  );
}
