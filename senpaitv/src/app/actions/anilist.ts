'use server';

import { saveEpisodeProgress } from '@/lib/aniList/mutations/saveProgress';
import { setMediaListStatus } from '@/lib/aniList/mutations/saveStatus';

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

export async function setAniListStatus(
  accessToken: string,
  mediaId: number,
  status: "PLANNING" | "CURRENT" | "COMPLETED"
) {
  try {
    if (!accessToken) {
      return { success: false, error: 'AniList not connected' };
    }
    if (!mediaId) {
      return { success: false, error: 'Invalid media ID' };
    }
    const result = await setMediaListStatus(accessToken, mediaId, status);
    return { success: true, data: result };
  } catch (error) {
    console.error('AniList status update failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
