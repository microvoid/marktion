import { ApiUtils } from '@/libs';
import { AuthHelper } from '@/libs/helpers';
import { planHelper } from '@/libs/helpers/plan';
import { Prisma } from '@prisma/client';

export const POST = AuthHelper.validate(async (req: Request, ctx): Promise<Response> => {
  const body = (await req.json()) as Prisma.ProjectPlanCreateArgs['data'];

  if (ctx.user.anonymous) {
    return ApiUtils.error('Anonymous users cannot upgrade to Pro.');
  }

  const { project } = await planHelper.upgradeToPro(body.projectId!, body);

  return ApiUtils.success({
    project
  });
});
