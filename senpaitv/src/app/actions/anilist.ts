'use server';

import { saveEpisodeProgress } from '@/lib/aniList/mutations/saveProgress';

export async function updateAniListProgress(
  accessToken: string,
  mediaId: number,
  episodeNumber: number
) {
  try {
    if (!accessToken) {
      return { success: false, error: 'AniList not connected' };
    }

    if (!mediaId || episodeNumber < 1) {
      return { success: false, error: 'Invalid media ID or episode number' };
    }

    const result = await saveEpisodeProgress(accessToken, mediaId, episodeNumber);

    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error('Error updating AniList progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
