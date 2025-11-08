import { GraphQLClient } from "graphql-request";

const endpoint = "https://graphql.anilist.co";

export function createAuthenticatedClient(accessToken: string) {
  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}
