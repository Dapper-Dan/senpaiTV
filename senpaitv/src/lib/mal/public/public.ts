export async function getEpisodeDetails(animeId: number, episodeNumber: number) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes/${episodeNumber}`);
    if (!response.ok) {
      throw new Error(`Episode fetch error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Episode details fetch error:', error);
    throw new Error('Failed to fetch episode details');
  }
}
