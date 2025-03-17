import { RecipesList } from "@/components/RecipesList";
import { auth0 } from "@/lib/auth0";
import { getStaticData } from "graphql/build";
import type { Receipe } from "types/receipe";

export default async function Page() {
  const receipes = await getStaticData("receipes") as Receipe[];
  const categoriesMap = receipes.map((receipe) => {
    return receipe.categories;
  });
  const categories = Array.from(new Set(categoriesMap.flat()));

  const session = await auth0.getSession();

  return (
    <section className="section pt-5">
      <div className="container is-max-widescreen">
        <RecipesList receipes={receipes} categories={categories} session={session} />
      </div>
    </section>
  );
}
