import { IngredientList } from "./IngredientList";
import { ShareIngredients } from "./ShareIngredients";

export function BuyList({
  buyList, 
}) {
  return (
    <>
      <h2 className="title is-3 is-size-4-mobile mb-3 mt-6">
        Einkaufsliste
        <ShareIngredients ingredients={buyList} />
      </h2>
      <div className="block">
        <IngredientList />
      </div>
    </>
  );
}