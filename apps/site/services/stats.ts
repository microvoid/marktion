import { prisma } from '@/libs';

export const PostStats = {
  read(id: string) {
    return prisma.post.update({
      where: {
        id: id
      },
      data: {
        clicks: {
          increment: 1
        }
      }
    });
  }
};
