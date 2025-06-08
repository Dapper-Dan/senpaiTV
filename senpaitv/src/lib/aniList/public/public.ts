import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";
const client = new GraphQLClient(endpoint);

export const getTrendingAnime = async () => {
  const query = gql`
    query {
      Page(perPage: 5) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
        }
      }
    }
  `;
  return client.request(query);
};
