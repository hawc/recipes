/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ChangeEvent, useState, useEffect, useRef, createRef } from 'react';
import Image from 'next/image';
import {
  ShoppingCartIcon,
  XMarkIcon,
  ArrowUpOnSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';
import { gql, GraphQLClient } from 'graphql-request';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Ingredient, Receipe } from 'types/receipe';
import { getStaticData } from 'graphql/build';

const ENDPOINT =
  process.env.NODE_ENV === `production`
    ? `https://kochen.hawc.de/api/receipes`
    : `http://localhost:3000/api/receipes`;

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

export async function getStaticProps() {
  // can't use graphql here, because API doesn't exist when getStaticProps runs
  const receipes = await getStaticData(`receipes`);
  const categories = (receipes as Receipe[]).map((receipe) => {
    return receipe.categories;
  });

  return {
    props: {
      posts: receipes,
      categories,
    },
    revalidate: 10,
  };
}

export default function Home({ posts, categories }) {
  const [mounted, setMounted] = useState(false);
  const ingredientsRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedReceipes, setSelectedReceipes] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [postdata, setPostdata] = useState(posts);
  const categorydata = categories;
  const [filteredPosts, setFilteredPosts] = useState(postdata);
  const [isNativeShare, setNativeShare] = useState(false);

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (navigator.share) {
      setNativeShare(true);
    }
    setMounted(true);
  }, []);

  function mergeArrays(ingredientArrays: Ingredient[][]): Ingredient[] {
    let finalList = [];

    if (ingredientArrays.length > 0) {
      ingredientArrays.forEach((ingredientArray) => {
        finalList = [...finalList, ...ingredientArray];
      });
    }
    finalList.sort((a, b) => a.name.localeCompare(b.name));

    return finalList;
  }

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
      setSelectedReceipes((selectedReceipes) => [...selectedReceipes, receipe]);
    }
  }

  useEffect(() => {
    const arr = mergeArrays(
      [...selectedReceipes].map((receipe) => receipe.ingredients),
    );
    const res = Array.from(
      arr
        .reduce((acc, { amount, ...r }) => {
          const key = JSON.stringify(r);
          const current = acc.get(key) || { ...r, amount: 0 };
          return acc.set(key, { ...current, amount: current.amount + amount });
        }, new Map())
        .values(),
    );
    setBuyList(res);
  }, [selectedReceipes]);

  function optionsChangeHandler(event: ChangeEvent<HTMLSelectElement>): void {
    if (event.currentTarget) {
      let f = postdata;
      if (event.currentTarget.value !== ``) {
        f = postdata.filter((post) => {
          return post.categories.includes(event.currentTarget.value);
        });
      }

      setFilteredPosts(f);
    }
  }

  async function deleteReceipe(id: number): Promise<void> {
    const client = new GraphQLClient(ENDPOINT, { headers: {} });

    const receipes = await client.request(QUERY_DELETE_RECEIPE, { id });
    if (receipes) {
      setPostdata(receipes.deleteReceipe);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const postRefs = {};

  const postListItems = postdata.map((post: Receipe) => {
    const isFiltered = filteredPosts
      .map((filteredPost) => filteredPost.id)
      .includes(post.id);
    postRefs[post.id] = createRef();
    return (
      <div key={post.id}>
        <Desktop>
          <div
            onMouseEnter={() => post.images.length > 0 && setPreviewImage(post)}
            onMouseLeave={() => setPreviewImage(null)}
            onBlur={() => setPreviewImage(null)}
            ref={postRefs[post.id]}
            className={
              isFiltered ? `is-flex is-size-5` : `is-flex is-size-5 opacity-40`
            }
          >
            <Link
              onFocus={() => post.images.length > 0 && setPreviewImage(post)}
              onBlur={() => setPreviewImage(null)}
              className="has-text-primary is-flex-basis-100"
              href={`/rezept/${post.slug}`}
            >
              {post.name}
            </Link>
            {user && (
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
            ref={postRefs[post.id]}
            className={
              isFiltered ? `is-size-5 is-flex` : `is-size-5 is-flex opacity-40`
            }
          >
            <Link
              className="has-text-primary is-flex-basis-100"
              href={`/rezept/${post.slug}`}
            >
              {post.name}
            </Link>
            {user && (
              <button
                title="Rezept löschen"
                type="button"
                className="button is-white is-small"
                onClick={() => deleteReceipe(post.id)}
              >
                <TrashIcon />
              </button>
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
  });

  return (
    <section className="section pt-5">
      <div className="container is-max-desktop">
        <h2 className="title is-3 is-size-4-mobile is-flex mb-3 mt-2 is-align-items-center">
          <div className="mr-4">Rezepte</div>
          <div className="select is-inline-block is-size-6 is-rounded">
            <select
              aria-label="Kategorie auswählen"
              onChange={optionsChangeHandler}
            >
              <option value="">Alle</option>
              {categorydata.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </h2>
        {mounted && (
          <div className="columns">
            <div className="column">
              {postListItems}
              {buyList.length > 0 && (
                <>
                  <h2 className="title is-3 is-size-4-mobile mb-3 mt-6">
                    Einkaufsliste
                    {isNativeShare && (
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
                  </h2>
                  <div className="block">
                    <IngredientList
                      ref={ingredientsRef}
                      list={buyList}
                    ></IngredientList>
                  </div>
                </>
              )}
            </div>
            <Desktop>
              <div className="column">
                {previewImage?.images.length > 0 && (
                  <div>
                    <Link href={`/rezept/${previewImage?.slug}`}>
                      <img
                        src={`/uploads/${previewImage?.images[0].name}`}
                        className="box p-0"
                        alt="Rezeptvorschau"
                        width={previewImage?.images[0].width}
                        height={previewImage?.images[0].height}
                      />
                    </Link>
                  </div>
                )}
              </div>
            </Desktop>
          </div>
        )}
      </div>
    </section>
  );
}
