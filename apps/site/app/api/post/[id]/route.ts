import { AuthHandler } from '@/libs';
import { PostService } from '@/services';

export const DELETE = AuthHandler.validate<{ id: string }>(async (req, ctx) => {
  const postId = ctx.params.id;
  const res = await PostService.delPost(postId, ctx.user.id);

  return AuthHandler.success(res);
});
