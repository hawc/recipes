import { Receipe } from "types/receipe";
import { initDb } from "./db";
import { resolvers } from "./resolvers";

export async function getStaticData(
  type: string,
  args?: { slug: string; },
): Promise<Receipe | Receipe[] | undefined> {
  initDb();
  if (type === "receipe") {
    if (!args) {
      return [];
    }
    const receipe = await resolvers.Query.Receipe(null, args);
    return receipe;
  }
  if (type === "receipes") {
    const receipes = await resolvers.Query.Receipes();
    return receipes;
  }

  return;
}
