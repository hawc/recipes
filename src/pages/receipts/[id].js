import { loadPost, loadPosts } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from '@/styles/Detail.module.scss';
import { useState, useEffect, useRef, mounted } from 'react';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { useMediaQuery } from 'react-responsive';

import {
  ArrowUpOnSquareIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  const posts = await loadPosts(`receipt`);
  const paths = posts.map((post) => ({
    params: { id: post.sys.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await loadPost(params.id);
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
  const ingredients = postdata.fields.ingredients?.map((ingredient) => (
    <tr key={ingredient.fields.name}>
      <td>
        {(ingredient.fields.amount / postdata.fields.servings) * servings}{' '}
        {ingredient.fields.measurement}
      </td>
      <td>{ingredient.fields.name}</td>
    </tr>
  ));
  const categories = postdata.fields.category.map((category) => (
    <li key={category.fields.name}>{category.fields.name}</li>
  ));

  const [isNativeShare, setNativeShare] = useState(false);
  useEffect(() => {
    if (navigator.share) {
      setNativeShare(true);
    }
  }, []);

  function handleServingsChange(e) {
    setServings(e.target.value);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  function Desktop({ children }) {
    const useDesktopMediaQuery = () =>
      useMediaQuery({
        minWidth: 769,
      });

    return <>{useDesktopMediaQuery() ? children : null}</>;
  }

  function Mobile({ children }) {
    const useDesktopMediaQuery = () =>
      useMediaQuery({
        minWidth: 769,
      });

    return <>{useDesktopMediaQuery() ? null : children}</>;
  }

  function share() {
    if (!isNativeShare) {
      return;
    }
    navigator
      .share({
        text: ingredientsRef.current.innerText,
      })
      .then(() => {
        console.log('Successful share');
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Share card was probably just dismissed');
          return;
        }

        console.warn(error);
      });
  }

  const renderOptions = {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node, children) => {
        if (node.data.target.sys.contentType.sys.id === 'ingredient') {
          return (
            <span>
              {(node.data.target.fields.amount / postdata.fields.servings) *
                servings}{' '}
              {node.data.target.fields.measurement}{' '}
              {node.data.target.fields.name}
            </span>
          );
        }
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        if (node.data.target.sys.contentType.sys.id === 'codeBlock') {
          return (
            <pre>
              <code>{node.data.target.fields.code}</code>
            </pre>
          );
        }

        if (node.data.target.sys.contentType.sys.id === 'videoEmbed') {
          return (
            <iframe
              src={node.data.target.fields.embedUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              title={node.data.target.fields.title}
              allowFullScreen={true}
            />
          );
        }
      },

      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        return (
          <img
            src={`https://${node.data.target.fields.file.url}`}
            height={node.data.target.fields.file.details.image.height}
            width={node.data.target.fields.file.details.image.width}
            alt={node.data.target.fields.description}
          />
        );
      },
    },
  };

  return (
    <section className="section pt-5">
      <div className="container is-max-desktop">
        <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">
          {postdata.fields.name}
        </h2>
        <ul className={styles.categories}>{categories}</ul>
        {mounted && (
          <Mobile>
            <div className="block px-0 pb-2">
              <Image
                className="box p-0"
                src={'https:' + postdata.fields.images[0].fields.file.url}
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
        <h3 className="title is-3 is-size-4-mobile mb-3">
          Zutaten
          <button
            className="button is-white ml-1 is-va-baseline"
            type="button"
            onClick={share}
          >
            <span className="icon is-medium">
              <ArrowUpOnSquareIcon />
            </span>
          </button>
        </h3>
        <div className="block mb-5 pb-2">
          <div className="columns">
            <div className="column is-4">
              <div className="field is-flex is-align-items-center">
                <div className="field-label is-normal is-flex-grow-0 mr-3 mb-0 pt-0">
                  <div className="control">Portionen:</div>
                </div>
                <div className="field-body is-flex">
                  <div className="control">
                    <button
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
                      onChange={handleServingsChange}
                    />
                  </div>
                  <div className="control">
                    <button
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
              <table className="table is-fullwidth" ref={ingredientsRef}>
                <thead>
                  <tr>
                    <th>Menge</th>
                    <th>Zutat</th>
                  </tr>
                </thead>
                <tbody>{ingredients}</tbody>
              </table>
            </div>
            {mounted && (
              <Desktop>
                <div className="column pl-5 is-relative">
                  <Image
                    className="box p-0 t-5 mb-2 is-sticky"
                    src={'https:' + postdata.fields.images[0].fields.file.url}
                    alt="Rezeptbild"
                    width={
                      postdata.fields.images[0].fields.file.details.image.width
                    }
                    height={
                      postdata.fields.images[0].fields.file.details.image.height
                    }
                  />
                </div>
              </Desktop>
            )}
          </div>
        </div>
        <h3 className="title is-3 is-size-4-mobile">Zubereitung</h3>
        <div className="content">
          {documentToReactComponents(
            postdata.fields.description,
            renderOptions,
          )}
        </div>
        {postdata.fields.source?.length ? (
          <div className="block pt-2">
            Quelle:{' '}
            <a
              className="has-text-primary"
              target="_blank"
              rel="noreferrer noopener"
              href={postdata.fields.source}
            >
              {' '}
              {postdata.fields.source}
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
    </section>
  );
}
