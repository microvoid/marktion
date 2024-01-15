import { postService, AuthHelper, ApiUtils } from '@/libs';

export const POST = AuthHelper.validate(async (req, ctx) => {
  const { ids, projectId } = (await req.json()) as { ids: string[]; projectId: string };
  const res = await postService.reownerAnonymousPosts({
    userId: ctx.user.id,
    ids,
    projectId
  });

  return ApiUtils.success(res);
});
