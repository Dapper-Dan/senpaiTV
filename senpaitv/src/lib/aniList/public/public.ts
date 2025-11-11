import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";
const client = new GraphQLClient(endpoint);

export const getTrendingAnime = async () => {
  const query = gql`
    query GetTrendingAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME, status: RELEASING) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          averageScore
          popularity
          episodes
          status
          season
          seasonYear
          studios {
            nodes {
              name
            }
          }
          tags {
            category
            description
            name
          }
          genres
          streamingEpisodes {
            site
          }
          externalLinks {
            type
            site
          }
          reviews {
            nodes {
              summary
            }
            pageInfo {
              total
            }
          }
          description
          stats {
            scoreDistribution {
              score
              amount
            }
          }
          trailer {
            site
            thumbnail
            id
          }
        }
      }
    }
  `;
  return client.request(query, { page: 1, perPage: 20 });
};

export const getGhibliAnime = async () => {
  const query = gql`
    query Studios($search: String) {
      Page {
        studios(search: $search) {
          media {
            nodes {
              id
              type
              averageScore
              title {
                english
              }
              coverImage {
                extraLarge
                color
              }
              bannerImage
              genres
              streamingEpisodes {
                site
              }
              externalLinks {
                type
                site
              }
              reviews {
                nodes {
                  summary
                }
                pageInfo {
                  total
                }
              }
              description
              stats {
                scoreDistribution {
                  score
                  amount
                }
              }
              trailer {
                site
                thumbnail
                id
              }
            }
          }
        }
      }
    }
  `;
  return client.request(query, { search: "Ghibli" });
};

export const getIsekaiAnime = async () => {
  const query = gql`
    query GetIsekaiAnime($tag: String, $sort: [MediaSort]) {
      Page {
        media(type: ANIME, tag: $tag, sort: $sort) {
          id
          title {
            english
          }
          averageScore
          bannerImage
          coverImage {
            extraLarge
            large
            medium
          }
          genres
          streamingEpisodes {
            site
          }
          externalLinks {
            type
            site
          }
          reviews {
            nodes {
              summary
            }
            pageInfo {
              total
            }
          }
          description
          stats {
            scoreDistribution {
              score
              amount
            }
          }
          trailer {
            site
            thumbnail
            id
          }
        }
      }
    }
  `;
  return client.request(query, { tag: "Isekai", sort: "POPULARITY_DESC" });
};

export const getRankedAnime = async () => {
  const query = gql`
    query GetRankedAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: SCORE_DESC, type: ANIME, status: FINISHED) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          averageScore
          popularity
          episodes
          status
          season
          seasonYear
          studios {
            nodes {
              name
            }
          }
          reviews {
            nodes {
              summary
            }
            pageInfo {
              total
            }
          }
          description
          stats {
            scoreDistribution {
              score
              amount
            }
          }
          tags {
            category
            description
            name
          }
          genres
          externalLinks {
            type
            site
          }
          trailer {
            site
            thumbnail
            id
          }
        }
      }
    }
  `;
  return client.request(query, { page: 1, perPage: 20 });
};

export const getAnimeById = async (id: number) => {
  const query = gql`
    query GetAnimeById($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        averageScore
        popularity
        episodes
        duration
        status
        season
        seasonYear
        studios {
          nodes {
            name
          }
        }
        tags {
          category
          description
          name
        }
        genres
        externalLinks {
          type
          site
          url
        }
        reviews {
          nodes {
            summary
          }
          pageInfo {
            total
          }
        }
        description
        stats {
          scoreDistribution {
            score
            amount
          }
        }
        trailer {
          site
          thumbnail
          id
        }
        streamingEpisodes {
          site
          thumbnail
          title
          url
        }
      }
    }
  `;
  const result = await client.request(query, { id }) as any;
  return result.Media;
};

export const getAnimeByIds = async (ids: number[]) => {
  if (!ids || ids.length === 0) return [];

  const query = gql`
    query GetAnimeByIds($ids: [Int], $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(id_in: $ids, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          averageScore
          popularity
          episodes
          duration
          status
          season
          seasonYear
          studios {
            nodes {
              name
            }
          }
          tags {
            category
            description
            name
          }
          genres
          externalLinks {
            type
            site
            url
          }
          reviews {
            nodes {
              summary
            }
            pageInfo {
              total
            }
          }
          description
          stats {
            scoreDistribution {
              score
              amount
            }
          }
          trailer {
            site
            thumbnail
            id
          }
          streamingEpisodes {
            site
            thumbnail
            title
            url
          }
        }
      }
    }
  `;

  const results = await client.request(query, { ids: ids, page: 1, perPage: ids.length }) as any;
  const media = results?.Page?.media ?? [];
  return media;
};

export const searchAnime = async (query: string) => {
  const searchQuery = gql`
    query SearchAnime($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
          averageScore
          popularity
          episodes
          status
          season
          seasonYear
          studios {
            nodes {
              name
            }
          }
          tags {
            category
            description
            name
          }
          genres
          externalLinks {
            type
            site
            url
          }
          reviews {
            nodes {
              summary
            }
            pageInfo {
              total
            }
          }
          description
          stats {
            scoreDistribution {
              score
              amount
            }
          }
          trailer {
            site
            thumbnail
            id
          }
          streamingEpisodes {
            site
            thumbnail
            title
            url
          }
        }
      }
    }
  `;
  const result = await client.request(searchQuery, { 
    search: query, 
    page: 1, 
    perPage: 50 
  }) as any;
  return result.Page.media;
};
