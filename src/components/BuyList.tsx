import { Ingredient } from "types/recipe";
import { IngredientList } from "./IngredientList";
import { ShareIngredients } from "./ShareIngredients";

interface BuyListProps {
  buyList: Ingredient[];
}

export function BuyList({
  buyList, 
}: BuyListProps) {
  return (
    <>
      <h2 className="title is-3 is-size-4-mobile mb-3 mt-6">
        Einkaufsliste
        <ShareIngredients />
      </h2>
      <div className="block">
        <IngredientList list={buyList}/>
      </div>
    </>
  );
}