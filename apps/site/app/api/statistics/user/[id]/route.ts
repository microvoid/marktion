import { AuthHandler, userService } from '@/libs';

export const GET = AuthHandler.validate<{ id: string }>(async (req, ctx) => {
  const userId = ctx.params.id;
  const userStatics = await userService.getUserStatistics(userId);

  return AuthHandler.success(userStatics);
});
