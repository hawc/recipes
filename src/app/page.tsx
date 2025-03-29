import { RecipesList } from "@/components/RecipesList";
import { BuyListContextProvider } from "@/context/BuyListContext";
import { auth0 } from "@/lib/auth0";
import { getStaticRecipesData } from "graphql/build";

export default async function Page() {
  const recipes = await getStaticRecipesData();

  if (!recipes) {
    return (
      <section className="section pt-5">
        <div className="container is-max-widescreen">
          <h2 className="title is-2 is-size-3-mobile mb-1 mt-2">
            Rezepte nicht gefunden
          </h2>
        </div>
      </section>
    );
  }

  const categoriesMap = recipes.map((recipe) => {
    return recipe.categories;
  });
  const categories = Array.from(new Set(categoriesMap.flat()));

  const session = await auth0.getSession();

  return (
    <BuyListContextProvider>
      <section className="section pt-5">
        <div className="container is-max-widescreen">
          <RecipesList recipes={recipes} categories={categories} session={session} />
        </div>
      </section>
    </BuyListContextProvider>
  );
}
