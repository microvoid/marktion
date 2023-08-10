import { nanoid } from 'nanoid';
import { Post } from '@prisma/client';
import { prisma } from '@/libs';
import { ErrorUtils } from '@/utils';
import { UserFirstMarkdown } from '@/constants-server';

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

export function getPostsByUserId(userId: string, cursorId?: string, take = 15) {
  return prisma.post.findMany({
    cursor: cursorId
      ? {
          id: cursorId
        }
      : undefined,
    take,
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true
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
