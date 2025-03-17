// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  createSchema, createYoga,
} from "graphql-yoga";
import { initDb } from "graphql/db";
import { resolvers } from "graphql/resolvers";
import { typeDefinitions } from "graphql/schema";
import type {
  NextApiRequest, NextApiResponse,
} from "next";

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
  graphqlEndpoint: "/api/receipes",
});
