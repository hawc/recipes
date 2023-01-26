import { gql, GraphQLClient } from 'graphql-request';
import { createRef, useState, useEffect, useRef } from 'react';
import { arrayMoveImmutable } from 'array-move';
import styles from '@/styles/Detail.module.scss';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';
import { getStaticData } from 'graphql/build';
import { Receipe } from 'types/receipe';

const ENDPOINT =
  process.env.NODE_ENV === `production`
    ? `https://kochen.hawc.de/api/receipes`
    : `http://localhost:3000/api/receipes`;

const QUERY_RECEIPES = gql`
  query getReceipes {
    Receipes {
      name
      slug
    }
  }
`;

const QUERY = gql`
  mutation editReceipe(
    $slug: String!
    $name: String!
    $categories: [String]!
    $ingredients: [IngredientInput]!
    $servings: Int!
    $description: String!
    $images: [ImageInput]!
    $source: String!
  ) {
    editReceipe(
      slug: $slug
      name: $name
      categories: $categories
      ingredients: $ingredients
      servings: $servings
      description: $description
      images: $images
      source: $source
    ) {
      id
      name
      slug
    }
  }
`;

const UNITS = [`Stück`, `ml`, `l`, `g`, `kg`, `TL`, `EL`, `Prise(n)`];
const REQUIRED_FIELDS = [
  `slug`,
  `name`,
  `servings`,
  `description`,
  `source`,
  `ingredients`,
  `categories`,
];

export async function getStaticPaths() {
  let paths = [];
  try {
    const client = new GraphQLClient(ENDPOINT, { headers: {} });
    const receipes = await client.request(QUERY_RECEIPES);
    paths = receipes.Receipes.map((receipe: Receipe) => ({
      params: { slug: receipe.slug },
    }));
  } catch (error) {
    console.log(error);
  }

  return { paths, fallback: `blocking` };
}
export async function getStaticProps({ params }) {
  // can't use graphql here, because API doesn't exist when getStaticProps runs
  const receipe = await getStaticData(`receipe`, { slug: params.slug });
  return {
    props: {
      post: receipe,
    },
  };
}
export default function NewReceipt({ post }) {
  const form = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [slug] = useState(post.slug);
  const [name, setName] = useState(post.name);
  const [description, setDescription] = useState(post.description);
  const [source, setSource] = useState(post.source);
  const [servings, setServings] = useState(post.servings);
  const [categories, setCategories] = useState(post.categories);
  const [images, setImages] = useState(post.images);
  const [ingredientList, setIngredientList] = useState(post.ingredients);
  const ingredientsRef = useRef(null);
  const [ingredientAmount, setIngredientAmount] = useState(``);
  const [ingredientUnit, setIngredientUnit] = useState(``);
  const [ingredientName, setIngredientName] = useState(``);
  const [submitData, setSubmitData] = useState({});
  const nameInput = createRef<HTMLInputElement>();
  const categoryInput = createRef<HTMLInputElement>();
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const receipeFormData = new FormData(form.current);
    const submitFormData: any = Object.fromEntries(receipeFormData);
    submitFormData.slug = slug;
    submitFormData.servings = parseInt(submitFormData.servings);
    submitFormData.categories = categories;
    submitFormData.ingredients = ingredientList;
    submitFormData.images = images;

    setSubmitData(submitFormData);

    const isValid = REQUIRED_FIELDS.every((fieldName) => {
      const field = submitFormData[fieldName];
      const valid = typeof field === `number` ? field : field.length;
      if (!valid) {
        return false;
      }
      return true;
    });

    setSubmitDisabled(!isValid);
  }, [categories, ingredientList, images, name, description, source, slug]);

  function handleSubmit() {
    const client = new GraphQLClient(ENDPOINT, { headers: {} });
    client.request(QUERY, submitData).then(() => {
      setName(``);
      setDescription(``);
      setSource(``);
      setServings(2);
      setCategories([]);
      setImages([]);
      setIngredientList([]);
    });
  }

  function addCategory() {
    if (
      categoryInput.current.value &&
      !categories.includes(categoryInput.current.value)
    ) {
      setCategories([...categories, categoryInput.current.value]);
      categoryInput.current.value = ``;
    }
  }
  function removeCategory(category: string) {
    if (category) {
      setCategories([...categories.filter((cat) => cat !== category)]);
    }
  }
  function addIngredient(event) {
    event.preventDefault();
    const ingredient = {
      amount: parseInt(ingredientAmount),
      unit: ingredientUnit,
      name: ingredientName,
    };
    if (ingredient.amount && ingredient.unit && ingredient.name) {
      if (
        !ingredientList.includes(ingredient) &&
        !ingredientList.map((ing) => ing.name).includes(ingredient.name)
      ) {
        setIngredientList([...ingredientList, ingredient]);
        setIngredientAmount(``);
        setIngredientUnit(``);
        setIngredientName(``);
      }
    }
  }
  function removeIngredient(ingredient) {
    if (ingredient) {
      setIngredientList([
        ...ingredientList.filter(
          (ingredientFromList) => ingredientFromList !== ingredient,
        ),
      ]);
    }
  }
  function moveIngredientUp(ingredient) {
    if (ingredient) {
      const pos = ingredientList.indexOf(ingredient);
      const newList = arrayMoveImmutable(ingredientList, pos, pos - 1);
      setIngredientList(newList);
    }
  }
  function moveIngredientDown(ingredient) {
    if (ingredient) {
      const pos = ingredientList.indexOf(ingredient);
      const newList = arrayMoveImmutable(ingredientList, pos, pos + 1);
      setIngredientList(newList);
    }
  }
  function updateImages(event) {
    const imageFiles = event.target.files;
    const filesLength = imageFiles.length;

    for (let i = 0; i < filesLength; i++) {
      const reader = new FileReader();
      const file = imageFiles[i];

      reader.onloadend = () => {
        if (reader.result) {
          const tempImage = new Image();
          tempImage.src = reader.result as string;

          tempImage.onload = function () {
            const dbImage = {
              name: file.name,
              type: file.type,
              size: file.size,
              width: tempImage.width,
              height: tempImage.height,
              src: reader.result,
            };
            if (!images.map((image) => image.name).includes(dbImage.name)) {
              // setImages([...images, image]);
              setImages([dbImage]);
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  }
  function removeImage(imageName) {
    if (imageName) {
      setImages([...images.filter((image) => image.name !== imageName)]);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="section pt-5">
      <form
        onSubmit={(e) => e.preventDefault()}
        ref={form}
        className="container is-max-desktop"
      >
        <input
          placeholder="Rezeptname"
          type="text"
          className="input input-faux is-fullwidth title is-2 is-size-3-mobile mb-1 mt-2"
          name="name"
          ref={nameInput}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <ul className={styles.categories}>
          {categories.map((category) => (
            <li
              className="is-flex is-alignItems-center has-text-black"
              key={category}
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="button is-white ml-1 py-0 px-3 mr-3 is-height-5 is-va-baseline"
              >
                <span className="icon is-medium">
                  <XMarkIcon />
                </span>
              </button>
            </li>
          ))}
          <li className="is-flex is-alignItems-center">
            <input
              type="text"
              className="input input-faux is-va-baseline is-height-4"
              placeholder="Kategorie"
              ref={categoryInput}
              onKeyUp={(event) => {
                if (event.key === `Enter`) {
                  addCategory();
                }
              }}
            />
            <button
              type="button"
              className="button is-small is-primary ml-1 py-0 is-height-5 is-va-baseline"
            >
              <span className="icon is-medium">
                <PlusIcon onClick={addCategory} />
              </span>
            </button>
          </li>
        </ul>
        {mounted && (
          <Mobile>
            <div className="block px-0 pb-2">
              <div className="field">
                <div className="file has-name is-boxed">
                  <label className="file-label flex-basis-full">
                    <input
                      className="file-input"
                      type="file"
                      name="images"
                      onInput={updateImages}
                      multiple
                    />
                    <span className="file-cta">
                      <span className="file-label">Foto auswählen…</span>
                    </span>
                    <div className="is-flex is-flex-direction-column">
                      {images.map((image) => (
                        <div key={image.name} className="file-name is-flex">
                          <div className="is-flex-grow-1">{image.name}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeImage(image.name);
                            }}
                            className="button is-white py-0 px-3 is-height-4 is-va-baseline"
                          >
                            <span className="icon is-medium">
                              <XMarkIcon />
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Mobile>
        )}
        <h3 className="title is-3 is-size-4-mobile mb-3">Zutaten</h3>
        <div className="block mb-5 pb-2">
          <div className="columns">
            <div className="column is-6 is-relative">
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
                        name="servings"
                        onChange={(event) =>
                          setServings(parseInt(event.target.value))
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
                  list={ingredientList}
                  upEvent={moveIngredientUp}
                  downEvent={moveIngredientDown}
                  removeEvent={removeIngredient}
                >
                  <tr
                    onKeyUp={(event) => {
                      event.preventDefault();
                      if (event.key === `Enter`) {
                        addIngredient(event);
                      }
                    }}
                  >
                    <td className="td-input-select">
                      <input
                        className="hide-spin-buttons input input-faux py-0"
                        type="number"
                        placeholder="1000"
                        value={ingredientAmount}
                        onChange={(event) =>
                          setIngredientAmount(event.currentTarget.value)
                        }
                      />
                      <div className="input-faux select">
                        <select
                          className="input-faux py-0"
                          value={ingredientUnit}
                          onChange={(event) =>
                            setIngredientUnit(event.currentTarget.value)
                          }
                        >
                          <option value="">Einheit</option>
                          {UNITS.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="td-input" colSpan={2}>
                      <div className="is-flex">
                        <input
                          className="input input-faux hide-spin-buttons py-0"
                          type="text"
                          placeholder="Zutat"
                          value={ingredientName}
                          onChange={(event) =>
                            setIngredientName(event.currentTarget.value)
                          }
                        />
                        <button
                          type="button"
                          title="Zutat hinzufügen"
                          className="button is-small is-height-5 is-primary"
                          disabled={
                            !ingredientAmount ||
                            !ingredientUnit ||
                            !ingredientName ||
                            ingredientList
                              .map((ing) => ing.name)
                              .includes(ingredientName)
                          }
                          onClick={addIngredient}
                        >
                          <span className="icon is-medium">
                            <PlusIcon></PlusIcon>
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </IngredientList>
              </div>
            </div>
            {mounted && (
              <Desktop>
                <div className="column pl-5 is-relative">
                  <div className="block px-0 pb-2">
                    <div className="box p-0 t-5 is-sticky field">
                      <div className="file has-name is-boxed">
                        <label className="file-label flex-basis-full">
                          <input
                            className="file-input"
                            type="file"
                            name="images"
                            onInput={updateImages}
                            multiple
                          />
                          <span className="file-cta">
                            <span className="file-label">Foto auswählen…</span>
                          </span>
                          <div className="is-flex is-flex-direction-column">
                            {images.map((image) => (
                              <div
                                key={image.name}
                                className="file-name is-flex"
                              >
                                <div className="is-flex-grow-1">
                                  {image.name}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeImage(image.name);
                                  }}
                                  className="button is-white py-0 px-3 is-height-4 is-va-baseline"
                                >
                                  <span className="icon is-medium">
                                    <XMarkIcon />
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Desktop>
            )}
          </div>
        </div>
        <h3 className="title is-3 is-size-4-mobile">Zubereitung</h3>
        <div className="content">
          <div className="field">
            <div className="control">
              <textarea
                name="description"
                className="textarea input-faux"
                placeholder="Beschreibung"
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="block pt-2 is-flex">
          Quelle:{` `}
          <input
            type="text"
            name="source"
            className="input input-faux is-fullwidth ml-3"
            placeholder="https://..."
            value={source}
            onChange={(event) => setSource(event.currentTarget.value)}
          />
        </div>
        <button
          type="button"
          disabled={submitDisabled}
          onClick={handleSubmit}
          className="button is-primary"
        >
          Hochladen
        </button>
        {(submitDisabled && (
          <p className="mt-2">
            <span className="tag is-danger is-light">
              Es sind noch nicht alle Felder gefüllt.
            </span>
          </p>
        )) || (
          <p className="mt-2">
            <span className="tag is-success is-light">
              Rezept kann hochgeladen werden.
            </span>
          </p>
        )}
      </form>
    </section>
  );
}
