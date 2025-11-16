'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma';

export async function getOrCreateUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  return await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
  });
}

export async function updateUserProfile(input: { name?: string; image?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }
  const name = typeof input.name === 'string' ? input.name.trim() : undefined;
  const image = typeof input.image === 'string' ? input.image.trim() : undefined;
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(image !== undefined ? { image } : {}),
    },
  });
  return { success: true, user };
}
