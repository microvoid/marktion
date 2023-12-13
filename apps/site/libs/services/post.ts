import { nanoid } from 'nanoid';
import { Post, Prisma } from '@prisma/client';
import { UserFirstMarkdown, ErrorUtils, prisma } from '@/libs';

export async function initUserFirstPost(userId: string) {
  return upsert(
    {
      markdown: UserFirstMarkdown,
      title: 'Hello World',
      publicStats: 'private'
    },
    userId
  );
}

export async function upsert(post: Partial<Post>, userId: string) {
  const { markdown, slug = nanoid(5), id, title, publicStats } = post;

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
        userId
      }
    });

    return post;
  }
}

export const defaultGetPostsByUserIdOptions = {
  page: 0,
  pageSize: 10,
  orderBy: {
    createdAt: 'desc'
  } as Prisma.PostOrderByWithRelationInput
};
export function getPostsByUserId(
  userId: string,
  input: Partial<typeof defaultGetPostsByUserIdOptions> = defaultGetPostsByUserIdOptions
) {
  const options = {
    ...defaultGetPostsByUserIdOptions,
    ...input
  };

  return Promise.all([
    prisma.post.findMany({
      take: options.pageSize,
      skip: options.page * options.pageSize,
      where: {
        userId
      },
      orderBy: options.orderBy,
      include: {
        user: true
      }
    }),
    countPostsByUserId(userId)
  ]);
}

export function countPostsByUserId(userId: string) {
  return prisma.post.count({
    where: {
      userId
    }
  });
}

export async function getPostBySlugId(slug: string) {
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

export async function delPost(id: string, userId: string) {
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
