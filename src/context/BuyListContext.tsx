"use client";

import {
  createContext, PropsWithChildren,
  RefObject, useContext, useRef,
} from "react";
import type { Recipe } from "types/recipe";

interface BuyListContextProps {
  exportList: RefObject<HTMLTableSectionElement | null>;
}

export const BuyListContext = createContext({} as BuyListContextProps);

export function BuyListContextProvider({
  children, 
}: PropsWithChildren<{ recipe?: Recipe }>) {
  const exportList = useRef<HTMLTableSectionElement | null>(null);

  const value = {
    exportList,
  };

  return (
    <BuyListContext.Provider value={value}>
      {children}
    </BuyListContext.Provider>
  );
}

export const useBuyListContext = () => useContext(BuyListContext);