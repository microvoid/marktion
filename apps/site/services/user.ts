import { prisma } from '@/libs';

export function createGuest() {
  return prisma.user.create({
    data: {
      name: 'guest',
      anonymous: true
    }
  });
}

export function getUser(id: string) {
  return prisma.user.findFirst({
    where: {
      id
    }
  });
}
