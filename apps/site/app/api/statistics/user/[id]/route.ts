import { ApiUtils, AuthHelper, userService } from '@/libs';

export const GET = AuthHelper.validate<{ id: string }>(async (req, ctx) => {
  const userId = ctx.params.id;
  const userStatics = await userService.getUserStatistics(userId);

  return ApiUtils.success(userStatics);
});
