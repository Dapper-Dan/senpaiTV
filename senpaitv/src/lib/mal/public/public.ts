import dotenv from 'dotenv';

dotenv.config();

// The Jikan API provides more read-only GET endpoints than the official MAL API, so it is used for retrieving more defined data
// The official MAL API is used for simple GET requests and write operations (POST requests), as Jikan does not support them.


export async function getRankedAnime() {
  const response = await fetch('https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=20', {
  headers: {
    'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID!,
  },
})

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

export async function getTrendingAnime() {
  const response = await fetch('https://api.jikan.moe/v4/top/anime')

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}
