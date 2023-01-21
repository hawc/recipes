import { gql, GraphQLClient } from 'graphql-request';
import { createRef, useState } from 'react';
import slugify from 'slugify';

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
  const nameInput = createRef<HTMLInputElement>();
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
