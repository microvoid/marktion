import { UserStatistics, prisma } from '@/libs';
import { postService } from './post';

class UserService {
  async createGuest() {
    const guest = await prisma.user.create({
      data: {
        name: 'guest',
        anonymous: true
      }
    });

    await postService.initUserFirstPost(guest.id);

    return guest;
  }

  getUser(id: string) {
    return prisma.user.findFirst({
      where: {
        id
      }
    });
  }

  async getUserStatistics(id: string): Promise<UserStatistics> {
    const postCount = await prisma.post.count({
      where: {
        userId: id
      }
    });

    return {
      postCount
    };
  }
}

export const userService = new UserService();
