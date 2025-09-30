export async function getAnimeEpisodes(malId: number) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/episodes`);

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Episodes fetch error:', error);
    throw new Error('Failed to fetch episodes');
  }
}
