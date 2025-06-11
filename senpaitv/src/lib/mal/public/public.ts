import dotenv from 'dotenv';

dotenv.config();

export async function getTrendingAnime() {
  const response = await fetch('https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=4', {
  headers: {
    'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID!,
  },
})

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}
