import { Receipe } from "types/receipe";

export function getReceipeIds(receipes: Receipe[]): number[] {
  return receipes.map((receipe) => Number(receipe.id));
}
