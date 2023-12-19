import { postService, AuthHelper, ApiUtils } from '@/libs';

export const DELETE = AuthHelper.validate<{ id: string }>(async (req, ctx) => {
  const postId = ctx.params.id;
  const res = await postService.delPost(postId, ctx.user.id);

  return ApiUtils.success(res);
});
