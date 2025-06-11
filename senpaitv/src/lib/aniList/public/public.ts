import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";
const client = new GraphQLClient(endpoint);

export const getTrendingAnime = async () => {
  const query = gql`
    query {
      Page(perPage: 5) {
        media(type: ANIME, sort: SCORE_DESC) {
          id
          title {
            romaji
          }
          coverImage {
            extraLarge
          }
        }
      }
    }
  `;
  return client.request(query);
};
