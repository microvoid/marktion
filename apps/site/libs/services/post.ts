import { nanoid } from 'nanoid';
import { Post, Prisma } from '@prisma/client';
import { ErrorUtils, prisma } from '@/libs';

class PostService {
  async upsert(post: Partial<Post>) {
    const { markdown, slug = nanoid(5), id, title, publicStats, userId, projectId } = post;

    if (!markdown) {
      return new Error('markdown is required');
    }

    if (id) {
      const post = await prisma.post.update({
        data: {
          title,
          markdown,
          publicStats
        },
        where: {
          id
        }
      });

      return post;
    } else {
      const post = await prisma.post.create({
        data: {
          slug,
          title,
          markdown,
          publicStats,
          projectId,
          userId
        }
      });

      return post;
    }
  }

  getPosts(
    where: Prisma.PostWhereInput,
    input: Partial<typeof defaultGetPostsOptions> = defaultGetPostsOptions
  ) {
    const options = {
      ...defaultGetPostsOptions,
      ...input
    };

    return Promise.all([
      prisma.post.findMany({
        take: options.pageSize,
        skip: options.page * options.pageSize,
        where: where,
        orderBy: options.orderBy,
        include: {
          user: true
        }
      }),
      prisma.post.count({
        where
      })
    ]);
  }

  async getPostBySlugId(slug: string) {
    const post = await prisma.post.findFirst({
      where: {
        slug
      },
      include: {
        user: true
      }
    });

    return post;
  }

  async delPost(id: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: {
        id: id
      }
    });

    if (!post) {
      throw ErrorUtils.notFound();
    }

    if (post.userId !== userId) {
      throw ErrorUtils.notFound();
    }

    const res = await prisma.post.delete({
      where: {
        id: id
      }
    });

    return res;
  }
}

export const postService = new PostService();

export const defaultGetPostsOptions = {
  page: 0,
  pageSize: 10,
  orderBy: {
    createdAt: 'desc'
  } as Prisma.PostOrderByWithRelationInput
};
