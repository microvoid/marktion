import { PostService, AuthHandler } from '@/libs';
import { Post } from '@prisma/client';

export const GET = AuthHandler.validate(async (req, ctx) => {
  const query = req.nextUrl.searchParams;

  const pageSize = Number(query.get('pageSize')) || 10;
  const page = Number(query.get('page')) || 0;

  const [posts, count] = await PostService.getPostsByUserId(ctx.user.id, page, pageSize);

  return AuthHandler.success({
    posts,
    count
  });
});

export const POST = AuthHandler.validate(async (req, ctx) => {
  const post = (await req.json()) as Post;
  const result = await PostService.upsert(post, ctx.user.id);

  return AuthHandler.success(result);
});
