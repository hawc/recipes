"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function NewCategory({
  categories, addCategory, 
}: {
  categories: string[];
  addCategory: (name: string) => void;
}) {
  const [name, setName] = useState<string | undefined>();

  return (
    <>
      <input
        type="text"
        className="input input-faux is-va-baseline is-height-4"
        placeholder="Kategorie"
        onChange={(event) => setName(event.target.value)}
        onKeyUp={(event) => {
          if (event.key === "Enter" && name && !categories.includes(name)) {
            addCategory(name);
            setName(undefined);
          }
        }}
      />
      <button
        type="button"
        className="button is-small is-primary ml-1 py-0 is-height-5 is-va-baseline"
      >
        <span className="icon is-medium">
          <PlusIcon onClick={() => {
            if (name && !categories.includes(name)) {
              addCategory(name);
              setName(undefined);
            }
          }} />
        </span>
      </button>
    </>
  );
}
