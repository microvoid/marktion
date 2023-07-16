import { prisma } from '@/libs';
import { initUserFirstPost } from './post';

export async function createGuest() {
  const guest = await prisma.user.create({
    data: {
      name: 'guest',
      anonymous: true
    }
  });

  await initUserFirstPost(guest.id);

  return guest;
}

export function getUser(id: string) {
  return prisma.user.findFirst({
    where: {
      id
    }
  });
}
