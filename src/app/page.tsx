import { RecipesList } from "@/components/RecipesList";
import { BuyListContextProvider } from "@/context/BuyListContext";
import { auth0 } from "@/lib/auth0";
import { getStaticData } from "graphql/build";
import type { Recipe } from "types/recipe";

export default async function Page() {
  const recipes = await getStaticData("recipes") as Recipe[];
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
