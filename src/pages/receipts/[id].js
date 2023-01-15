import { loadPost, loadPosts } from '@/lib/contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import styles from '@/styles/Detail.module.css';
import { useState } from 'react';

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
  const postdata = JSON.parse(post);
  const [servings, setServings] = useState(1);
  const ingredients = postdata.fields.ingredients?.map((ingredient) => (
    <li key={ingredient.fields.name}>
      {ingredient.fields.amount * servings}
      {ingredient.fields.measurement} {ingredient.fields.name}
    </li>
  ));
  const categories = postdata.fields.category.map((category) => (
    <li key={category.fields.name}>{category.fields.name}</li>
  ));

  function handleServingsChange(e) {
    setServings(e.target.value);
  }

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
      <ul className={styles.ingredients}>{ingredients}</ul>
      <h3>Zubereitung</h3>
      <div
        dangerouslySetInnerHTML={{
          __html: documentToHtmlString(postdata.fields.description),
        }}
      ></div>
    </div>
  );
}
