import { loadPost, loadPosts } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from '@/styles/Detail.module.css';
import { useState, useEffect, useRef } from 'react';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

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
  const [servings, setServings] = useState(1);
  console.log(postdata.fields);
  const ingredients = postdata.fields.ingredients?.map((ingredient) => (
    <li key={ingredient.fields.name}>
      {ingredient.fields.amount * servings}&nbsp;
      {ingredient.fields.measurement} {ingredient.fields.name}
    </li>
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
      .share({ text: ingredientsRef.current.textContent })
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
        // target the contentType of the EMBEDDED_ENTRY to display as you need
        if (node.data.target.sys.contentType.sys.id === 'ingredient') {
          return (
            <span>
              {node.data.target.fields.amount * servings}{' '}
              {node.data.target.fields.name}
            </span>
          );
        }
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        // target the contentType of the EMBEDDED_ENTRY to display as you need
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
        // render the EMBEDDED_ASSET as you need
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
    <div>
      <h2>{postdata.fields.name}</h2>
      <ul className={styles.categories}>{categories}</ul>
      <div className={styles.servings}>
        <label htmlFor="servings">Portionen&nbsp;</label>
        <input
          type="number"
          value={servings}
          min="1"
          onChange={handleServingsChange}
        />
      </div>
      <h3>Zutaten</h3>
      <ul className={styles.ingredients} ref={ingredientsRef}>
        {ingredients}
      </ul>
      <button type="button" onClick={share}>
        Zutaten speichern
      </button>
      <h3>Zubereitung</h3>
      <div>
        {documentToReactComponents(postdata.fields.description, renderOptions)}
      </div>
    </div>
  );
}
