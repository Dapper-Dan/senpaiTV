'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';
import { WatchlistStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getOrCreateUser } from './user';

export async function addToWatchlist(animeId: string, status: WatchlistStatus = 'WANT_TO_WATCH') {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Unauthorized');
    }

    const user = await getOrCreateUser();

    const watchlistItem = await prisma.watchlistItem.upsert({
      where: {
        userId_animeId: {
          userId: user.id,
          animeId: animeId,
        },
      },
      update: {
        status: status,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        animeId: animeId,
        status: status,
      },
    });

    revalidatePath('/watchlist');
    revalidatePath(`/series/${animeId}`);
    
    return { success: true, watchlistItem };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw new Error('Failed to add to watchlist');
  }
}

export async function removeFromWatchlist(animeId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.watchlistItem.deleteMany({
      where: {
        userId: user.id,
        animeId: animeId,
      },
    });

    revalidatePath('/watchlist');
    revalidatePath(`/series/${animeId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw new Error('Failed to remove from watchlist');
  }
}

export async function updateWatchlistStatus(animeId: string, status: WatchlistStatus) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const watchlistItem = await prisma.watchlistItem.updateMany({
      where: {
        userId: user.id,
        animeId: animeId,
      },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/watchlist');
    revalidatePath(`/series/${animeId}`);
    
    return { success: true, watchlistItem };
  } catch (error) {
    console.error('Error updating watchlist status:', error);
    throw new Error('Failed to update watchlist status');
  }
}

export async function getUserWatchlist() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return [];
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        watchlist: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    return user?.watchlist || [];
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
}

export async function getWatchlistItem(animeId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return null;
    }

    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: {
        userId_animeId: {
          userId: user.id,
          animeId: animeId,
        },
      },
    });

    return watchlistItem;
  } catch (error) {
    console.error('Error fetching watchlist item:', error);
    return null;
  }
}
