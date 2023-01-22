import { loadPost, loadPosts, ReceipeFields } from '@/lib/contentfulClient';
import { getRenderOptions } from '@/lib/contentfulConfig';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from '@/styles/Detail.module.scss';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowUpOnSquareIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';
import type { Entry } from 'contentful';

export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: `blocking`,
    };
  }

  const posts = await loadPosts(`receipt`);
  const paths = posts.map((post: Entry<ReceipeFields>) => ({
    params: { slug: post.fields.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await loadPost(params.slug);
  return {
    props: {
      post: JSON.stringify(post),
    },
  };
}

export default function Receipt({ post }) {
  const [mounted, setMounted] = useState(false);
  const ingredientsRef = useRef(null);
  const postdata = JSON.parse(post);
  const [servings, setServings] = useState(postdata.fields.servings);
  const [isNativeShare, setNativeShare] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setNativeShare(true);
    }
    setMounted(true);
  }, []);

  return (
    <section className="section pt-5">
      <div className="container is-max-desktop">
        <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">
          {postdata.fields.name}
        </h2>
        <ul className={styles.categories}>
          {postdata.fields.category.map((category) => (
            <li key={category.fields.name}>{category.fields.name}</li>
          ))}
        </ul>
        {mounted && postdata.fields.images?.length > 0 && (
          <Mobile>
            <div className="block px-0 pb-2">
              <Image
                className="box p-0"
                src={`https:${postdata.fields.images[0].fields.file.url}`}
                alt="Rezeptbild"
                width={
                  postdata.fields.images[0].fields.file.details.image.width
                }
                height={
                  postdata.fields.images[0].fields.file.details.image.height
                }
              />
            </div>
          </Mobile>
        )}
        {postdata.fields.ingredients?.length > 0 && (
          <>
            <h3 className="title is-3 is-size-4-mobile mb-3">
              Zutaten
              {mounted && isNativeShare && postdata.fields.ingredients && (
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
                            onChange={(event) =>
                              setServings(event.target.value)
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
                      list={postdata.fields.ingredients?.map((ingredient) => ({
                        amount: ingredient.fields.absolute
                          ? ingredient.fields.amount
                          : (ingredient.fields.amount /
                              postdata.fields.servings) *
                            servings,
                        unit: ingredient.fields.measurement,
                        name: ingredient.fields.name,
                      }))}
                    ></IngredientList>
                  </div>
                </div>
                {mounted && postdata.fields.images?.length > 0 && (
                  <Desktop>
                    <div className="column pl-5 is-relative">
                      <Image
                        className="box p-0 t-5 is-sticky"
                        src={`https:${postdata.fields.images[0].fields.file.url}`}
                        alt="Rezeptbild"
                        width={
                          postdata.fields.images[0].fields.file.details.image
                            .width
                        }
                        height={
                          postdata.fields.images[0].fields.file.details.image
                            .height
                        }
                      />
                    </div>
                  </Desktop>
                )}
              </div>
            </div>
          </>
        )}
        <h3 className="title is-3 is-size-4-mobile">Zubereitung</h3>
        <div className="content">
          {documentToReactComponents(
            postdata.fields.description,
            getRenderOptions(postdata, servings),
          )}
        </div>
        {postdata.fields.source?.length && (
          <div className="block pt-2">
            Quelle:{` `}
            <a
              className="has-text-primary"
              target="_blank"
              rel="noreferrer noopener"
              href={postdata.fields.source}
            >
              {` `}
              {postdata.fields.source}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
