// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createYoga, createSchema } from 'graphql-yoga';
import type { NextApiRequest, NextApiResponse } from 'next';
import { initDb } from 'graphql/db';
import { typeDefinitions } from 'graphql/schema';
import { resolvers } from 'graphql/resolvers';

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

initDb();

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({
    typeDefs: typeDefinitions,
    resolvers,
  }),
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: `/api/receipes`,
});
