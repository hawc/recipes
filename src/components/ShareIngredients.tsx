"use client";

import { share } from "@/lib/browserApi";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import {
  useCallback, useEffect, useMemo, useState,
} from "react";

export function ShareIngredients({
  ingredients, 
}) {
  const [isNativeShare, setNativeShare] = useState(false);
  const strikedRows = []; // todo: implement

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shareData = useMemo(() => {
    // const data = Array.from(ingredients.current.children)
    //   .filter(
    //     (child: HTMLElement) => !strikedRows.includes(child.dataset.name),
    //   )
    //   .map((child: HTMLElement) => child.innerText.slice(0, -1));
    // const formattedData = data.join(`\n`);

    const formattedData = "";

    return formattedData;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strikedRows, ingredients]);

  useEffect(() => {
    if ("share" in navigator) {
      setNativeShare(true);
    }
  }, []);

  const handleShare = useCallback(() => {
    share(ingredients);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isNativeShare || !ingredients) {
    return;
  }

  return (
    <button
      title="Einkaufsliste teilen"
      type="button"
      className="button is-white ml-1 is-va-baseline"
      onClick={handleShare}
    >
      <span className="icon is-medium">
        <ArrowUpOnSquareIcon />
      </span>
    </button>
  );
}
