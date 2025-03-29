import { GraphQLClient } from "graphql-request";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://kochen.hawc.de/api/recipes"
    : "http://localhost:3000/api/recipes";

let client: GraphQLClient;

export function getClient() {
  if (!client) {
    client = new GraphQLClient(ENDPOINT, { headers: {} });
  }

  return client;
}