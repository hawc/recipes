import Link from 'next/link';
import { loadPosts } from '@/lib/contentful';
import { ChangeEvent, useState, createRef } from 'react';
import Image from 'next/image';
import { EyeIcon } from '@heroicons/react/24/solid';
import { useMediaQuery } from 'react-responsive';

function useDesktopMediaQuery() {
  return useMediaQuery({
    minWidth: 769,
  });
}

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

interface Receipt {
  readonly fields: ReceiptFields;
  readonly metadata: any;
  readonly sys: any;
}
interface ReceiptFields {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly category: string;
  readonly ingredients: string[];
  readonly source: string;
}

export default function Home({ posts, categories }) {
  const [previewImage, setPreviewImage] = useState(null);

  const postdata = JSON.parse(posts);
  const categorydata = JSON.parse(categories);
  const [filteredPosts, setFilteredPosts] = useState(postdata);

  function Mobile({ children }) {
    return <>{useDesktopMediaQuery() ? null : children}</>;
  }

  function handleReceiptHover(id) {
    if (!id) {
      setPreviewImage(null);
      return;
    }

    const previewImageObject = postdata.find(
      (receipt) => receipt.sys.id === id,
    );
    const previewImageSrc = previewImageObject?.fields.images[0]?.fields.file;
    setPreviewImage(previewImageSrc);
  }

  const postRefs = {};

  const postListItems = postdata.map((post: Receipt) => {
    const isFiltered = filteredPosts
      .map((filteredPost) => filteredPost.sys.id)
      .includes(post.sys.id);
    const opacityClass = isFiltered ? `is-size-5` : `is-size-5 opacity-50`;
    postRefs[post.sys.id] = createRef();
    return (
      <li
        onMouseEnter={() => handleReceiptHover(post.sys.id)}
        onMouseLeave={() => handleReceiptHover(null)}
        onBlur={() => handleReceiptHover(null)}
        key={post.sys.id}
        ref={postRefs[post.sys.id]}
        className={opacityClass}
      >
        <Link
          onFocus={() => handleReceiptHover(post.sys.id)}
          onBlur={() => handleReceiptHover(null)}
          className="has-text-primary"
          href={`/rezept/${post.fields.slug}`}
        >
          {post.fields.name}
        </Link>
        <Mobile>
          <button
            type="button"
            className="button is-white is-small ml-1"
            onFocus={() => handleReceiptHover(post.sys.id)}
            onClick={() => handleReceiptHover(post.sys.id)}
          >
            <span className="icon is-medium">
              <EyeIcon />
            </span>
          </button>
        </Mobile>
      </li>
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
            <select onChange={optionsChangeHandler}>
              <option value="">Alle</option>
              {categorydata.map((category: any) => (
                <option key={category.fields.name} value={category.fields.name}>
                  {category.fields.name}
                </option>
              ))}
            </select>
          </div>
        </h2>
        <div className="columns">
          <div className="column">
            <ul>{postListItems}</ul>
          </div>
          <div className="column">
            {previewImage && (
              <div>
                <Image
                  src={`https://${previewImage.url}`}
                  className="box p-0"
                  alt="Rezeptvorschau"
                  width={previewImage.details.image.width}
                  height={previewImage.details.image.height}
                ></Image>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
