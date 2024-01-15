import { postService, AuthHelper, ApiUtils } from '@/libs';

export const POST = AuthHelper.validate(async (req, ctx) => {
  const { ids } = (await req.json()) as { ids: string[] };
  const res = await postService.reownerAnonymousPosts(ctx.user.id, ids);

  return ApiUtils.success(res);
});
