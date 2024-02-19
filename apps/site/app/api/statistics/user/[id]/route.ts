import { ApiUtils, AuthHelper } from '@/libs';
import { statsHelper } from '@/libs/helpers';

export const GET = AuthHelper.validate<{ id: string }>(async (req, ctx) => {
  const userId = ctx.params?.id!;
  const userStatics = await statsHelper.getUserStatistics(userId);

  return ApiUtils.success(userStatics);
});
