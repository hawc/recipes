import { resolvers } from './resolvers';
import { initDb } from './db';
import { Receipe } from 'types/receipe';

export async function getStaticData(
  type: string,
  args?: any,
): Promise<Receipe | Receipe[]> {
  initDb();
  if (type === `receipe`) {
    const receipe = await resolvers.Query.Receipe(null, args);
    return receipe;
  }
  if (type === `receipes`) {
    const receipes = await resolvers.Query.Receipes();
    return receipes;
  }
}
