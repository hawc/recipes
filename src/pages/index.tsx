import { useSWRConfig } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  ShoppingCartIcon,
  XMarkIcon,
  ArrowUpOnSquareIcon,
  TrashIcon,
  PencilIcon,
  PhotoIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';
import { gql, GraphQLClient } from 'graphql-request';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Ingredient, Receipe } from 'types/receipe';
import { getStaticData } from 'graphql/build';
import { ThumbnailList } from '@/components/thumbnailList';

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
      categories: Array.from(new Set(categories.flat())),
    },
  };
}

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

async function fetcher(url: string) {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
}

function ListItem({
  post,
  isFiltered,
  setPreviewImage,
  selectedReceipes,
  setSelectedReceipes,
  setPostdata,
}) {
  const { mutate } = useSWRConfig();
  const { user } = useUser();

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

  async function deleteReceipe(id: number): Promise<void> {
    const client = new GraphQLClient(ENDPOINT, { headers: {} });

    const receipes = await client.request(QUERY_DELETE_RECEIPE, { id });
    mutate(`/`);
    if (receipes) {
      setPostdata(receipes.deleteReceipe);
    }
  }

  return (
    <>
      <div key={post.id}>
        <Desktop>
          <div
            onMouseEnter={() => post.images.length > 0 && setPreviewImage(post)}
            onMouseLeave={() => setPreviewImage(null)}
            onBlur={() => setPreviewImage(null)}
            className={`is-flex is-font-size-1-2 ${
              isFiltered ? `` : `opacity-40`
            }`}
          >
            <Link
              onFocus={() => post.images.length > 0 && setPreviewImage(post)}
              onBlur={() => setPreviewImage(null)}
              className="has-text-black is-flex-basis-100 mb-1"
              href={`/rezept/${post.slug}`}
            >
              {post.name}
            </Link>
            {user && (
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
              isFiltered ? `` : `opacity-40`
            }`}
          >
            <Link
              className="has-text-black is-flex-basis-100 mb-2"
              href={`/rezept/${post.slug}`}
            >
              {post.name}
            </Link>
            {user && (
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
    </>
  );
}

function BuyList({ buyList }) {
  const ingredientsRef = useRef(null);
  const [isNativeShare, setNativeShare] = useState(false);
  useEffect(() => {
    if (navigator.share) {
      setNativeShare(true);
    }
  }, []);

  return (
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
        <IngredientList ref={ingredientsRef} list={buyList}></IngredientList>
      </div>
    </>
  );
}

function getAllReceipeIds(receipes: Receipe[]): number[] {
  return receipes.map((receipe) => receipe.id);
}

export default function Home({ posts, categories }) {
  const [viewThumbnails, setViewThumbnails] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedReceipes, setSelectedReceipes] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [postdata, setPostdata] = useState(posts);
  const [filteredReceipes, setFilteredReceipes] = useState(() =>
    getAllReceipeIds(postdata),
  );

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  function optionsChangeHandler(
    selectedOption: string,
    receipes: Receipe[],
  ): void {
    let filteredPostdata = receipes;
    if (selectedOption !== ``) {
      filteredPostdata = receipes.filter((receipe) =>
        receipe.categories.includes(selectedOption),
      );
    }

    setFilteredReceipes(filteredPostdata.map((post) => post.id));
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <section className="section pt-5">
      <div className="container is-max-widescreen">
        <h2 className="title is-3 is-size-4-mobile is-flex mb-3 mt-2 is-align-items-center">
          <div className="mr-4 is-flex-grow-1-mobile">Rezepte</div>
          <div className="select is-inline-block is-size-6 is-rounded mr-2">
            <select
              aria-label="Kategorie auswählen"
              onChange={(event) =>
                optionsChangeHandler(event.currentTarget?.value, postdata)
              }
            >
              <option value="">Alle</option>
              {categories.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              title="Rezept löschen"
              type="button"
              className="button is-white"
              onClick={() => setViewThumbnails(!viewThumbnails)}
            >
              <span className="icon is-medium">
                {!viewThumbnails ? <PhotoIcon /> : <ListBulletIcon />}
              </span>
            </button>
          </div>
        </h2>
        {mounted &&
          (viewThumbnails ? (
            <ThumbnailList
              receipes={posts}
              filteredReceipes={filteredReceipes}
            ></ThumbnailList>
          ) : (
            <div className="columns">
              <div className="column">
                {postdata.map((post: Receipe) => (
                  <ListItem
                    key={post.id}
                    isFiltered={filteredReceipes.includes(post.id)}
                    setPostdata={setPostdata}
                    post={post}
                    setPreviewImage={setPreviewImage}
                    selectedReceipes={selectedReceipes}
                    setSelectedReceipes={setSelectedReceipes}
                  />
                ))}
                {buyList.length > 0 && <BuyList buyList={buyList} />}
              </div>
              <Desktop>
                <div className="column">
                  <div>
                    {previewImage?.images.length > 0 && (
                      <Link href={`/rezept/${previewImage?.slug}`}>
                        <Image
                          src={`/uploads/${
                            previewImage.images[0].name ?? `/uploads/blank.png`
                          }`}
                          className="box p-0 max-width-100"
                          alt="Rezeptvorschau"
                          width={previewImage?.images[0].width}
                          height={previewImage?.images[0].height}
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </Desktop>
            </div>
          ))}
      </div>
    </section>
  );
}
