'use server';

import { saveEpisodeProgress } from '@/lib/aniList/mutations/saveProgress';
import { setMediaListStatus } from '@/lib/aniList/mutations/saveStatus';
import { getUserPlanningMediaIds } from '@/lib/aniList/queries/getUserPlanning';
import { addToWatchlist, getUserWatchlist } from './watchlist';

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

export async function syncAniListWithWatchlist(accessToken: string) {
  try {
    if (!accessToken) {
      return { success: false, error: 'AniList not connected' };
    }

    const planningIds = await getUserPlanningMediaIds(accessToken);
    const planningSet = new Set(planningIds.map(String));

    const localItems = await getUserWatchlist();
    const localIdSet = new Set((localItems ?? []).map((it: any) => String(it.animeId)));

    let imported = 0;
    let pushed = 0;

    for (const id of planningIds) {
      const idStr = String(id);
      if (!localIdSet.has(idStr)) {
        try {
          await addToWatchlist(idStr, 'WANT_TO_WATCH' as any);
          imported++;
          localIdSet.add(idStr);
        } catch {
          // continue
        }
      }
    }

    for (const item of localItems ?? []) {
      const idStr = String(item.animeId);
      if (!planningSet.has(idStr) && item.status === 'WANT_TO_WATCH') {
        try {
          await setMediaListStatus(accessToken, parseInt(idStr, 10), 'PLANNING');
          pushed++;
        } catch {
          // continue
        }
      }
    }

    return { success: true, imported, pushed };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
