/* eslint-disable @next/next/no-img-element */
import { Categories } from "@/components/Categories";
import { IngredientList } from "@/components/IngredientList";
import { PortionedIngredients } from "@/components/PortionedIngredients";
import {
  Desktop, Mobile,
} from "@/components/responsive";
import { ShareIngredients } from "@/components/ShareIngredients";
import { auth0 } from "@/lib/auth0";
import { PencilIcon } from "@heroicons/react/24/outline";
import { gql } from "graphql-request";
import { getStaticData } from "graphql/build";
import { getClient } from "graphql/client";
import Image from "next/image";
import Link from "next/link";
import type { Receipe } from "types/receipe";

const QUERY_RECEIPES = gql`
  query getReceipes {
    Receipes {
      name
      slug
    }
  }
`;

export async function generateStaticParams() {
  const client = getClient();
  const {
    Receipes, 
  } = await client.request(QUERY_RECEIPES) as { Receipes: Receipe[] };

  return Receipes.map((receipe: Receipe) => ({
    slug: receipe.slug,
  }));
}

interface RecipeProps {
  params: Promise<{ slug: string }>;
}

export default async function Recipe({
  params, 
}: RecipeProps) {
  const slug = (await params).slug;

  const receipe = (await getStaticData("receipe", {
    slug,
  })) as Receipe;

  const session = await auth0.getSession();

  return (
    <section className="section pt-5">
      <div className="container is-max-widescreen">
        <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">
          <span className="pr-2">{receipe.name}</span>
          {session && (
            <>
              <Link
                className="button is-white is-vcentered"
                href={`/rezept/bearbeiten/${receipe.slug}`}
              >
                <span className="icon is-medium">
                  <PencilIcon />
                </span>
              </Link>
            </>
          )}
        </h2>
        <Categories categories={receipe.categories} />
        {receipe.images?.length > 0 && (
          <Mobile>
            <div className="block px-0 pb-2">
              <img
                className="box p-0"
                src={`/uploads/${
                  receipe.images[0].name ?? "/uploads/blank.png"
                }`}
                alt="Rezeptbild"
                width={receipe.images[0].width}
                height={receipe.images[0].height}
              />
            </div>
          </Mobile>
        )}
        {receipe.ingredients?.length > 0 && (
          <>
            <h3 className="title is-3 is-size-4-mobile mb-3">
              Zutaten
              <ShareIngredients ingredients={IngredientList} />
            </h3>
            <div className="block mb-5 pb-2">
              <div className="columns">
                <div className="column is-4 is-relative">
                  <div className="t-5 is-sticky">
                    <PortionedIngredients receipe={receipe} />
                  </div>
                </div>
                {receipe.images?.length > 0 && (
                  <Desktop>
                    <div className="column pl-5 is-relative">
                      <Image
                        className="box p-0 t-5 is-sticky"
                        src={`/uploads/${
                          receipe.images[0].name ?? "/uploads/blank.png"
                        }`}
                        alt="Rezeptbild"
                        width={receipe.images[0].width}
                        height={receipe.images[0].height}
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
          {receipe.description}
        </div>
        {receipe.source?.length && (
          <div className="block pt-2 is-overflow-wrap-anywhere">
            Quelle:{" "}
            <a
              className="has-text-black"
              target="_blank"
              rel="noreferrer noopener"
              href={receipe.source}
            >
              {" "}
              {receipe.source}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
