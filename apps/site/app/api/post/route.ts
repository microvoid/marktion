import { AuthHandler } from '@/libs';
import { PostService } from '@/services';
import { Post } from '@prisma/client';

export const GET = AuthHandler.validate(async (req, ctx) => {
  const posts = await PostService.getPostsByUserId(ctx.user.id);
  return AuthHandler.success(posts);
});

export const POST = AuthHandler.validate(async (req, ctx) => {
  const post = (await req.json()) as Post;
  const result = await PostService.upsert(post, ctx.user.id);

  return AuthHandler.success(result);
});
