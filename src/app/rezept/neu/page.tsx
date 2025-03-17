import { DesktopImageUpload } from "@/components/DesktopImageUpload";
import { EditCategories } from "@/components/EditCategories";
import { EditDescription } from "@/components/EditDescription";
import { EditIngredientList } from "@/components/EditIngredientList";
import { EditName } from "@/components/EditName";
import { EditServings } from "@/components/EditServings";
import { EditSource } from "@/components/EditSource";
import { MobileImageUpload } from "@/components/MobileImageUpload";
import { SubmitRecipe } from "@/components/SubmitRecipe";
import { RecipeContextProvider } from "@/context/RecipeContext";

export default function Page() {
  return (
    <RecipeContextProvider>
      <section className="section pt-5">
        <form
          className="container is-max-widescreens"
        >
          <EditName />
          <EditCategories />
          <MobileImageUpload />
          <h3 className="title is-3 is-size-4-mobile mb-3">Zutaten</h3>
          <div className="block mb-5 pb-2">
            <div className="columns">
              <div className="column is-6 is-relative is-overflow-auto">
                <div className="t-5 is-sticky">
                  <div className="field is-flex is-align-items-center">
                    <EditServings />
                  </div>
                  <EditIngredientList />
                </div>
              </div>
              <DesktopImageUpload />
            </div>
          </div>
          <h3 className="title is-3 is-size-4-mobile">Zubereitung</h3>
          <div className="content">
            <EditDescription />
          </div>
          <div className="block pt-2 is-flex">
            <EditSource />
          </div>
          <SubmitRecipe />
        </form>
      </section>
    </RecipeContextProvider>
  );
}
