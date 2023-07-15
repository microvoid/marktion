import { AuthHandler } from '@/libs';
import { PostService } from '@/services';
import { Post } from '@prisma/client';

export async function GET(req: Request) {}

export const POST = AuthHandler.validate(async (req, ctx) => {
  const post = (await req.json()) as Post;
  const result = await PostService.upsert(post, ctx.user.id);

  return AuthHandler.success(result);
});
