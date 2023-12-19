import { postService, AuthHandler, defaultGetPostsByUserIdOptions } from '@/libs';
import { Post } from '@prisma/client';

export const GET = AuthHandler.validate(async (req, ctx) => {
  const query = req.nextUrl.searchParams;

  const pageSize = Number(query.get('pageSize')) || 10;
  const page = Number(query.get('page')) || 0;
  const orderBy = query.get('orderBy');
  const order = query.get('order');

  const [posts, count] = await postService.getPostsByUserId(ctx.user.id, {
    page,
    pageSize,
    orderBy: orderBy ? { [orderBy]: order } : defaultGetPostsByUserIdOptions.orderBy
  });

  return AuthHandler.success({
    posts,
    count
  });
});

export const POST = AuthHandler.validate(async (req, ctx) => {
  const post = (await req.json()) as Post;
  const result = await postService.upsert(post, ctx.user.id);

  return AuthHandler.success(result);
});
