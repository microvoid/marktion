import { prisma } from '@/libs';

class UserService {
  async createGuest() {
    const guest = await prisma.user.create({
      data: {
        name: 'guest',
        anonymous: true
      }
    });

    return guest;
  }

  getUser(id: string) {
    return prisma.user.findFirst({
      where: {
        id
      }
    });
  }
}

export const userService = new UserService();
