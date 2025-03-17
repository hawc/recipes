"use client";

import { useState } from "react";

export function NewCategory({
  categories, addCategory, 
}) {
  const [name, setName] = useState<string | undefined>();

  return (
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
  );
}
