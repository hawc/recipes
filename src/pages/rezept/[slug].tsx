/* eslint-disable @next/next/no-img-element */
import styles from '@/styles/Detail.module.scss';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  ArrowUpOnSquareIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';
import { gql, GraphQLClient } from 'graphql-request';
import { Receipe } from 'types/receipe';
import { getStaticData } from 'graphql/build';
import useSWR from 'swr';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';

const ENDPOINT =
  process.env.NODE_ENV === `production`
    ? `https://kochen.hawc.de/api/receipes`
    : `http://localhost:3000/api/receipes`;

const QUERY_RECEIPES = gql`
  query getReceipes {
    Receipes {
      name
      slug
    }
  }
`;

const fetcher = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  let paths = [];
  try {
    const client = new GraphQLClient(ENDPOINT, { headers: {} });
    const receipes = await client.request(QUERY_RECEIPES);
    paths = receipes.Receipes.map((receipe: Receipe) => ({
      params: { slug: receipe.slug },
    }));
  } catch (error) {
    console.log(error);
  }

  return { paths, fallback: `blocking` };
}

interface DetailProps {
  receipe: Receipe;
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<DetailProps>> {
  // can't use graphql here, because API doesn't exist when getStaticProps runs
  const receipe = (await getStaticData(`receipe`, {
    slug: params.slug,
  })) as Receipe;

  return {
    props: {
      receipe,
    },
  };
}

export default function Receipt({
  receipe,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [image, setImage] = useState<string>(``);
  const ingredientsRef = useRef(null);
  const postdata = receipe;
  const [servings, setServings] = useState<number>(postdata.servings);
  const [isNativeShare, setNativeShare] = useState(false);

  const { user } = useUser();

  const { data } = useSWR(() => {
    return postdata.images[0].name
      ? `/api/image?name=${postdata.images[0].name}`
      : null;
  }, fetcher);

  useEffect(() => {
    if (navigator.share) {
      setNativeShare(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setImage(data);
    }
  }, [data]);

  return (
    <section className="section pt-5">
      <div className="container is-max-desktop">
        <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">
          <span className="pr-2">{postdata.name}</span>
          {user && (
            <>
              <Link
                className="button is-white is-vcentered"
                href={`/rezept/bearbeiten/${postdata.slug}`}
              >
                <span className="icon is-medium">
                  <PencilIcon />
                </span>
              </Link>
            </>
          )}
        </h2>
        <ul className={styles.categories}>
          {postdata.categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
        {mounted && postdata.images?.length > 0 && image && (
          <Mobile>
            <div className="block px-0 pb-2">
              <img
                className="box p-0"
                src={`data:image/png;base64,${image}`}
                alt="Rezeptbild"
                width={postdata.images[0].width}
                height={postdata.images[0].height}
              />
            </div>
          </Mobile>
        )}
        {postdata.ingredients?.length > 0 && (
          <>
            <h3 className="title is-3 is-size-4-mobile mb-3">
              Zutaten
              {mounted && isNativeShare && postdata.ingredients && (
                <button
                  title="Einkaufsliste teilen"
                  type="button"
                  className="button is-white ml-1 is-va-baseline"
                  onClick={() => ingredientsRef.current.shareList()}
                >
                  <span className="icon is-medium">
                    <ArrowUpOnSquareIcon />
                  </span>
                </button>
              )}
            </h3>
            <div className="block mb-5 pb-2">
              <div className="columns">
                <div className="column is-4 is-relative">
                  <div className="t-5 is-sticky">
                    <div className="field is-flex is-align-items-center">
                      <div className="field-label is-normal is-flex-grow-0 mr-3 mb-0 pt-0">
                        <div className="control">Portionen:</div>
                      </div>
                      <div className="field-body is-flex">
                        <div className="control">
                          <button
                            title="Portion entfernen"
                            className="button is-white px-2"
                            type="button"
                            disabled={servings <= 1}
                            onClick={() => {
                              if (servings > 1) {
                                setServings(servings - 1);
                              }
                            }}
                          >
                            <span className="icon">
                              <MinusIcon />
                            </span>
                          </button>
                        </div>
                        <div className="control">
                          <input
                            className="input is-static is-width-40px has-text-centered has-text-weight-bold	hide-spin-buttons"
                            type="number"
                            value={servings}
                            min="1"
                            placeholder="Portionen"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              setServings(parseInt(event.target.value))
                            }
                          />
                        </div>
                        <div className="control">
                          <button
                            title="Portion hinzufügen"
                            className="button is-white px-2"
                            type="button"
                            onClick={() => setServings(servings + 1)}
                          >
                            <span className="icon">
                              <PlusIcon />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <IngredientList
                      ref={ingredientsRef}
                      list={postdata.ingredients?.map((ingredient) => ({
                        amount:
                          (ingredient.amount / postdata.servings) * servings,
                        unit: ingredient.unit,
                        name: ingredient.name,
                      }))}
                    ></IngredientList>
                  </div>
                </div>
                {mounted && postdata.images?.length > 0 && image && (
                  <Desktop>
                    <div className="column pl-5 is-relative">
                      <img
                        className="box p-0 t-5 is-sticky"
                        src={`data:image/png;base64,${image}`}
                        alt="Rezeptbild"
                        width={postdata.images[0].width}
                        height={postdata.images[0].height}
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
          {postdata.description}
        </div>
        {postdata.source?.length && (
          <div className="block pt-2 is-overflow-wrap-anywhere">
            Quelle:{` `}
            <a
              className="has-text-primary"
              target="_blank"
              rel="noreferrer noopener"
              href={postdata.source}
            >
              {` `}
              {postdata.source}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
