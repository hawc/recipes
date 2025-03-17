"use client";

import { getReceipeIds } from "@/utils/getReceipeIds";
import { mergeIngredientLists } from "@/utils/mergeIngredientLists";
import { SessionData } from "@auth0/nextjs-auth0/types";
import {
  ListBulletIcon, PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  useMemo, useState,
} from "react";
import type { Receipe } from "types/receipe";
import { BuyList } from "./BuyList";
import { ImageThumbnailList } from "./ImageThumbnailList";
import { ListItem } from "./ListItem";
import { PreviewImage } from "./PreviewImage";
import { Desktop } from "./responsive";

interface RecipesListProps {
  categories: string[];
  receipes: Receipe[];
  session: SessionData | null;
}

export function RecipesList({
  categories, receipes, session, 
}: RecipesListProps) {
  const [selectedReceipe, setSelectedReceipe] = useState<Receipe | null>(null);
  const [selectedReceipes, setSelectedReceipes] = useState<Receipe[]>([]);
  const [filteredReceipes, setFilteredReceipes] = useState<number[]>(() => getReceipeIds(receipes));
  const [viewThumbnails, setViewThumbnails] = useState(true);

  const buyList = useMemo(() => {
    const arr = mergeIngredientLists([...selectedReceipes].map((receipe) => receipe.ingredients));
    const res = Array.from(
      arr
        .reduce((acc, {
          amount, ...r 
        }) => {
          const key = JSON.stringify(r);
          const current = acc.get(key) || { ...r,
            amount: 0 };

          return acc.set(key, { ...current,
            amount: current.amount + amount });
        }, new Map())
        .values(),
    );

    return res;
  }, [selectedReceipes]);

  function optionsChangeHandler(selectedOption: string): void {
    let filteredPostdata = receipes;
    if (selectedOption !== "") {
      filteredPostdata = receipes.filter((receipe) => receipe.categories.includes(selectedOption));
    }

    setFilteredReceipes(filteredPostdata.map((post) => post.id ?? 0));
  }

  return (
    <>
      <h2 className="title is-3 is-size-4-mobile is-flex mb-3 mt-2 is-align-items-center">
        <div className="mr-4 is-flex-grow-1-mobile">Rezepte</div>
        <div className="select is-inline-block is-size-6 is-rounded mr-2">
          <select aria-label="Kategorie auswählen" onChange={(event) => optionsChangeHandler(event.currentTarget?.value)}>
            <option value="">Alle</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button title="Rezept löschen" type="button" className="button is-white" onClick={() => setViewThumbnails(!viewThumbnails)}>
            <span className="icon is-medium">{!viewThumbnails ? <PhotoIcon /> : <ListBulletIcon />}</span>
          </button>
        </div>
      </h2>
      {(viewThumbnails ? (
        <ImageThumbnailList receipes={receipes} filteredReceipes={filteredReceipes} />
      ) : (
        <div className="columns">
          <div className="column">
            {receipes.map((post: Receipe) => (
              <ListItem
                key={post.id}
                session={session}
                isFiltered={!!post.id && filteredReceipes.includes(post.id)}
                post={post}
                selectedReceipes={selectedReceipes}
                setSelectedReceipes={setSelectedReceipes}
                setSelectedReceipe={setSelectedReceipe}
              />
            ))}
            {buyList.length > 0 && <BuyList buyList={buyList} />}
          </div>
          <Desktop>
            <div className="column">
              {selectedReceipe && (
                <PreviewImage slug={selectedReceipe.slug} image={selectedReceipe.images[0]} />
              )}
            </div>
          </Desktop>
        </div>
      ))}
    </>
  );
}