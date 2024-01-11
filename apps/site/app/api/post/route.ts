import { postService, AuthHelper, defaultGetPostsOptions, ApiUtils } from '@/libs';
import { getSessionUser } from '@/libs/auth';
import { Post } from '@prisma/client';
import { NextRequest } from 'next/server';

export const GET = AuthHelper.validate(async (req, ctx) => {
  const query = req.nextUrl.searchParams;

  const pageSize = Number(query.get('pageSize')) || 10;
  const page = Number(query.get('page')) || 0;
  const orderBy = query.get('orderBy');
  const order = query.get('order');
  const projectId = query.get('projectId');

  const [posts, count] = await postService.getPosts(
    {
      projectId
    },
    {
      page,
      pageSize,
      orderBy: orderBy ? { [orderBy]: order } : defaultGetPostsOptions.orderBy
    }
  );

  return ApiUtils.success({
    posts,
    count
  });
});

export const POST = async function (req: NextRequest, { params }: { params: unknown }) {
  const post = (await req.json()) as Post;
  const user = await getSessionUser();

  if (!user) {
    // anonymous;
    const result = await postService.upsert(post);
    return ApiUtils.success(result);
  }

  const handler = AuthHelper.validate(async (req, ctx) => {
    const result = await postService.upsert({
      ...post,
      userId: ctx.user.id
    });

    return ApiUtils.success(result);
  });

  return handler(req, { params });
};
