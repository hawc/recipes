import { loadPost, loadPosts } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from '@/styles/Detail.module.scss';
import { useState, useEffect, useRef } from 'react';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import {
  ArrowUpOnSquareIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/solid';

// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another blog post)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

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
    <section className="section">
      <div className="container">
        <h2 className="title is-2 mb-1">{postdata.fields.name}</h2>
        <ul className={styles.categories}>{categories}</ul>
        <h3 className="title is-3">
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
        <div className="block">
          <div className={styles.servings}>
            <div className="field has-addons is-flex is-align-items-center">
              <div className="field-label is-normal is-flex-grow-0 mr-3 mb-0 pt-0">
                <div className="control">Portionen:</div>
              </div>
              <div className="field-body is-flex">
                <div className="control">
                  <button
                    className="button is-ghost px-2"
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
                    className="button is-ghost px-2"
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
          </div>
        </div>
        <table className="table" ref={ingredientsRef}>
          <thead>
            <tr>
              <th>Menge</th>
              <th>Zutat</th>
            </tr>
          </thead>
          <tbody>{ingredients}</tbody>
        </table>
        <h3 className="title is-3">Zubereitung</h3>
        <div className="content">
          {documentToReactComponents(
            postdata.fields.description,
            renderOptions,
          )}
        </div>
        {postdata.fields.source?.length ? (
          <div className="block">
            Quelle:{' '}
            <a
              className="link"
              target="_blank"
              rel="noopener"
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
