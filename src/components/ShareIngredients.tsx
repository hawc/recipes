"use client";

import { useBuyListContext } from "@/context/BuyListContext";
import { share } from "@/lib/browserApi";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import {
  useCallback, useEffect, useState,
} from "react";

export function ShareIngredients() {
  const [isNativeShare, setNativeShare] = useState(false);
  const {
    exportList,
  } = useBuyListContext();
   
  useEffect(() => {
    if ("share" in navigator) {
      setNativeShare(true);
    }
  }, []);

  const handleShare = useCallback(() => {
    if (!exportList?.current) {
      return;
    }

    const data = Array.from(exportList.current.children)
      .filter(
        (child: HTMLElement) => child.dataset.striked === "false",
      )
      .map((child: HTMLElement) => child.innerText.slice(0, -1));
    const formattedData = data.join("\n");

    share(formattedData || "You already have everything you need! :)");
  }, [exportList]);

  if (!isNativeShare || !exportList) {
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
