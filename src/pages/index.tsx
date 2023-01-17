import Link from 'next/link';
import { loadPosts } from '@/lib/contentful';
import { ChangeEvent, useState, useEffect, createRef } from 'react';
import Image from 'next/image';
import { EyeIcon, DocumentPlusIcon } from '@heroicons/react/24/solid';
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
  const [mounted, setMounted] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageID, setPreviewImageID] = useState(null);

  const postdata = JSON.parse(posts);
  const categorydata = JSON.parse(categories);
  const [filteredPosts, setFilteredPosts] = useState(postdata);

  function Mobile({ children }) {
    return <>{useDesktopMediaQuery() ? null : children}</>;
  }

  function Desktop({ children }) {
    return <>{useDesktopMediaQuery() ? children : null}</>;
  }

  function handleReceiptHover(id) {
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

  function addToList(id) {
    let count = 1;
    count++;
  }
  useEffect(() => {
    setMounted(true);
  }, []);

  const postRefs = {};

  const postListItems = postdata.map((post: Receipt) => {
    const isFiltered = filteredPosts
      .map((filteredPost) => filteredPost.sys.id)
      .includes(post.sys.id);
    postRefs[post.sys.id] = createRef();
    return (
      <div key={post.sys.id}>
        <Desktop>
          <div
            onMouseEnter={() => handleReceiptHover(post.sys.id)}
            onMouseLeave={() => handleReceiptHover(null)}
            onBlur={() => handleReceiptHover(null)}
            ref={postRefs[post.sys.id]}
            className={
              isFiltered ? `is-flex is-size-5` : `is-flex is-size-5 opacity-50`
            }
          >
            <Link
              onFocus={() => handleReceiptHover(post.sys.id)}
              onBlur={() => handleReceiptHover(null)}
              className="has-text-primary is-flex-basis-100"
              href={`/rezept/${post.fields.slug}`}
            >
              {post.fields.name}
            </Link>
            <button
              type="button"
              className="button is-white is-small"
              onClick={() => addToList(post.sys.id)}
            >
              <span className="icon is-medium">
                <DocumentPlusIcon />
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
              type="button"
              className="button is-white is-small"
              onFocus={() => handleReceiptHover(post.sys.id)}
              onClick={() => handleReceiptHover(post.sys.id)}
            >
              <span className="icon is-medium">
                <EyeIcon />
              </span>
            </button>
            <button
              type="button"
              className="button is-white is-small"
              onClick={() => addToList(post.sys.id)}
            >
              <span className="icon is-medium">
                <DocumentPlusIcon />
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
          {mounted && <div className="column">{postListItems}</div>}
          <div className="column">
            {previewImage && (
              <div>
                <Link href={`/rezept/${previewImage?.fields.slug}`}>
                  <Image
                    src={`https://${previewImage?.fields.images[0]?.fields.file.url}`}
                    className="box p-0"
                    alt="Rezeptvorschau"
                    width={
                      previewImage?.fields.images[0]?.fields.file.details.image
                        .width
                    }
                    height={
                      previewImage?.fields.images[0]?.fields.file.details.image
                        .height
                    }
                  ></Image>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
