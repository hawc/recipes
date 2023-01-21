import { gql, GraphQLClient } from 'graphql-request';
import { createRef, useState, useEffect, useRef } from 'react';
import slugify from 'slugify';
import styles from '@/styles/Detail.module.scss';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Desktop, Mobile } from '@/components/responsive';
import { IngredientList } from '@/components/IngredientList';

const ENDPOINT = `/api/receipes`;

const QUERY = gql`
  mutation addReceipe(
    $name: String!
    $slug: String!
    $categories: [Int]!
    $ingredients: [Int]!
    $servings: Int!
    $description: String!
    $images: [Int]!
    $source: String!
  ) {
    addReceipe(
      name: $name
      slug: $slug
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

export default function NewReceipt() {
  const [mounted, setMounted] = useState(false);
  const [servings, setServings] = useState(2);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const ingredientsRef = useRef(null);
  const ingrendientInputAmount = useRef(null);
  const ingrendientInputUnit = useRef(null);
  const ingrendientInputName = useRef(null);

  const nameInput = createRef<HTMLInputElement>();
  const categoryInput = createRef<HTMLInputElement>();
  const [slug, setSlug] = useState(``);

  function handleClick(event) {
    event.preventDefault();
    const receipeFormData = new FormData(event.currentTarget);
    const submitData: any = Object.fromEntries(receipeFormData);
    submitData.servings = parseInt(submitData.servings);
    submitData.categories = [0];
    submitData.ingredients = [0];
    submitData.images = [0];
    console.log(submitData);
    const client = new GraphQLClient(ENDPOINT, { headers: {} });
    client.request(QUERY, submitData).then((data) => console.log(data));
  }

  function updateSlug(slug = null) {
    setSlug(
      slugify(slug ?? nameInput?.current?.value ?? ``, {
        replacement: `-`,
        strict: true,
        locale: `de`,
      }),
    );
  }
  function updateSlugDirectly(event) {
    updateSlug(event.currentTarget.value);
  }
  function updateSlugFromName() {
    updateSlug();
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
  function addIngredient() {
    const ingredient = {
      amount: ingrendientInputAmount.current.value,
      measurement: ingrendientInputUnit.current.value,
      name: ingrendientInputName.current.value,
    };
    if (
      ingredient.amount &&
      ingredient.measurement &&
      ingredient.name &&
      !ingredientList.includes(ingredient)
    ) {
      setIngredientList([...ingredientList, ingredient]);
      ingrendientInputAmount.current.value = ``;
      ingrendientInputUnit.current.value = ``;
      ingrendientInputName.current.value = ``;
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
  function updateImages(event) {
    const imageFiles = event.target.files;
    const filesLength = imageFiles.length;

    for (let i = 0; i < filesLength; i++) {
      const reader = new FileReader();
      const file = imageFiles[i];

      reader.onloadend = () => {
        const image = {
          name: file.name,
          type: file.type,
          size: file.size,
          src: reader.result,
        };
        if (
          reader.result &&
          !images.map((image) => image.name).includes(image.name)
        ) {
          setImages([...images, image]);
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
      <div className="container is-max-desktop">
        <input
          placeholder="Rezeptname"
          type="text"
          className="input input-faux is-fullwidth title is-2 is-size-3-mobile mb-1 mt-2"
          name="name"
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
                className="button is-white ml-1 py-0 px-3 mr-3 is-height-4 is-va-baseline"
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
              name="category"
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
              className="button is-white ml-1 py-0 is-height-4 is-va-baseline"
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
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      name="images"
                      multiple
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Foto auswählen…</span>
                    </span>
                    <span className="file-name">
                      Screen Shot 2017-07-29 at 15.54.25.png
                    </span>
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
                  removeEvent={removeIngredient}
                >
                  <tr
                    onKeyUp={(event) => {
                      if (event.key === `Enter`) {
                        addIngredient();
                      }
                    }}
                  >
                    <td className="td-input-select">
                      <input
                        className="hide-spin-buttons input input-faux py-0"
                        type="number"
                        placeholder="1000"
                        ref={ingrendientInputAmount}
                      />
                      <div className="input-faux select">
                        <select
                          className="input-faux py-0"
                          ref={ingrendientInputUnit}
                        >
                          <option value="">Einheit</option>
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                        </select>
                      </div>
                    </td>
                    <td className="td-input">
                      <input
                        className="input input-faux hide-spin-buttons py-0"
                        type="string"
                        placeholder="Zutat"
                        ref={ingrendientInputName}
                      />
                    </td>
                    <td>
                      <button
                        title="Zutat streichen"
                        className="button is-small is-white"
                        onClick={addIngredient}
                      >
                        <span className="icon is-medium">
                          <PlusIcon></PlusIcon>
                        </span>
                      </button>
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
          />
        </div>
      </div>
    </section>
  );

  return (
    <section className="section pt-5">
      <div className="container is-max-desktop">
        <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">Neues Rezept</h2>
        <form onSubmit={handleClick}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input"
                name="name"
                type="text"
                placeholder="Rezeptname"
                ref={nameInput}
                onChange={updateSlugFromName}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">URL-Titel</label>
            <div className="control">
              <input
                className="input"
                name="slug"
                type="text"
                placeholder="URL-Titel"
                value={slug}
                onChange={updateSlugDirectly}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Portionen</label>
            <div className="control">
              <input
                className="input"
                name="servings"
                type="number"
                placeholder="Portionen"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Kategorie(n)</label>
            <div className="control">
              <div className="select is-multiple">
                <select name="categories" multiple>
                  <option>Select dropdown</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Zutat(en)</label>
            <div className="control">
              <div className="select is-multiple">
                <select name="ingredients" multiple>
                  <option>Select dropdown</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Beschreibung</label>
            <div className="control">
              <textarea
                name="description"
                className="textarea"
                placeholder="Beschreibung"
              ></textarea>
            </div>
          </div>
          <div className="field">
            <div className="file has-name is-boxed">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  name="images"
                  multiple
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Foto auswählen…</span>
                </span>
                <span className="file-name">
                  Screen Shot 2017-07-29 at 15.54.25.png
                </span>
              </label>
            </div>
          </div>
          <div className="field">
            <label className="label">Quelle</label>
            <div className="control">
              <input
                className="input"
                name="source"
                type="text"
                placeholder="Quelle (URL)"
              />
            </div>
          </div>
          <button className="button is-primary" type="submit">
            Rezept speichern
          </button>
        </form>
      </div>
    </section>
  );
}
