import Link from 'next/link';
import { loadPosts } from '@/lib/contentfulClient';
import { ChangeEvent, useState, useEffect, useRef, createRef } from 'react';
import Image from 'next/image';
import {
  ShoppingCartIcon,
  XMarkIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/24/outline';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';
import { ReceipeFields } from '@/lib/contentfulClient';
import type { Entry } from 'contentful';

export async function getStaticProps() {
  const posts = await loadPosts(`receipt`);
  const categories = await loadPosts(`category`);
  return {
    props: {
      posts: JSON.stringify(posts),
      categories: JSON.stringify(categories),
    },
  };
}

export default function Home({ posts, categories }) {
  const [mounted, setMounted] = useState(false);
  const ingredientsRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageID, setPreviewImageID] = useState(null);
  const [selectedReceipes, setSelectedReceipes] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const postdata = JSON.parse(posts);
  const categorydata = JSON.parse(categories);
  const [filteredPosts, setFilteredPosts] = useState(postdata);
  const [isNativeShare, setNativeShare] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setNativeShare(true);
    }
  }, []);

  function handleReceipeHover(id) {
    if (previewImageID === id) {
      return;
    }
    setPreviewImageID(id);

    if (!id) {
      setPreviewImage(null);
      return;
    }

    const previewImageObject = postdata.find(
      (receipt) => receipt.sys.id === id,
    );
    setPreviewImage(previewImageObject);
  }

  function mergeArrays(ingredientArrays) {
    let finalList = [];

    if (ingredientArrays.length > 0) {
      ingredientArrays.forEach((ingredientArray) => {
        finalList = [...finalList, ...ingredientArray];
      });
    }
    finalList.sort((a, b) => a.name.localeCompare(b.name));

    return finalList;
  }

  function getIngredientList(ingredients) {
    return ingredients.map(({ fields }) => {
      return {
        amount: fields.amount,
        unit: fields.measurement,
        name: fields.name,
      };
    });
  }

  function isInSelectedReceipes(receipe) {
    const isInSelectedReceipes = selectedReceipes.find(
      (selectedReceipe) => selectedReceipe.sys.id === receipe.sys.id,
    );
    return new Boolean(isInSelectedReceipes).valueOf();
  }

  function addToList(receipe) {
    if (isInSelectedReceipes(receipe)) {
      setSelectedReceipes(
        selectedReceipes.filter(
          (selectedReceipe) => selectedReceipe.sys.id !== receipe.sys.id,
        ),
      );
    } else {
      setSelectedReceipes((selectedReceipes) => [...selectedReceipes, receipe]);
    }
  }

  useEffect(() => {
    const arr = mergeArrays(
      [...selectedReceipes].map((receipe) =>
        getIngredientList(receipe.fields.ingredients),
      ),
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const postRefs = {};

  const postListItems = postdata.map((post: Entry<ReceipeFields>) => {
    const isFiltered = filteredPosts
      .map((filteredPost) => filteredPost.sys.id)
      .includes(post.sys.id);
    postRefs[post.sys.id] = createRef();
    return (
      <div key={post.sys.id}>
        <Desktop>
          <div
            onMouseEnter={() => handleReceipeHover(post.sys.id)}
            onMouseLeave={() => handleReceipeHover(null)}
            onBlur={() => handleReceipeHover(null)}
            ref={postRefs[post.sys.id]}
            className={
              isFiltered ? `is-flex is-size-5` : `is-flex is-size-5 opacity-40`
            }
          >
            <Link
              onFocus={() => handleReceipeHover(post.sys.id)}
              onBlur={() => handleReceipeHover(null)}
              className="has-text-primary is-flex-basis-100"
              href={`/rezept/${post.fields.slug}`}
            >
              {post.fields.name}
            </Link>
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
            ref={postRefs[post.sys.id]}
            className={
              isFiltered ? `is-size-5 is-flex` : `is-size-5 is-flex opacity-40`
            }
          >
            <Link
              className="has-text-primary is-flex-basis-100"
              href={`/rezept/${post.fields.slug}`}
            >
              {post.fields.name}
            </Link>
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

  function optionsChangeHandler(event: ChangeEvent<HTMLSelectElement>): void {
    if (event.currentTarget) {
      let f = postdata;
      if (event.currentTarget.value !== ``) {
        f = postdata.filter((post) => {
          return post.fields.category
            .map((category) => category.fields.name)
            .includes(event.currentTarget.value);
        });
      }

      setFilteredPosts(f);
    }
  }

  return (
    <section className="section pt-5">
      <div className="container is-max-desktop">
        <h2 className="title is-3 is-size-4-mobile is-flex mb-3 mt-2">
          <div className="mr-4">Rezepte</div>
          <div className="select is-inline-block is-size-5 is-size-6-mobile is-rounded">
            <select
              aria-label="Kategorie auswählen"
              onChange={optionsChangeHandler}
            >
              <option value="">Alle</option>
              {categorydata.map((category: any) => (
                <option key={category.fields.name} value={category.fields.name}>
                  {category.fields.name}
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
                {previewImage && (
                  <div>
                    <Link href={`/rezept/${previewImage?.fields.slug}`}>
                      <Image
                        src={`https://${previewImage?.fields.images[0]?.fields.file.url}`}
                        className="box p-0"
                        alt="Rezeptvorschau"
                        width={
                          previewImage?.fields.images[0]?.fields.file.details
                            .image.width
                        }
                        height={
                          previewImage?.fields.images[0]?.fields.file.details
                            .image.height
                        }
                      ></Image>
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
