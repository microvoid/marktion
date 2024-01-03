import { ApiUtils } from '@/libs';
import { AuthHelper } from '@/libs/helpers';
import { planHelper } from '@/libs/helpers/plan';
import { Prisma, ProjectPlanPayMethod } from '@prisma/client';

export const POST = AuthHelper.validate(async (req: Request, ctx): Promise<Response> => {
  const body = (await req.json()) as Prisma.ProjectPlanCreateArgs['data'];

  if (ctx.user.anonymous) {
    return ApiUtils.error('Anonymous users cannot upgrade to Pro.');
  }

  if (body.payMethod === ProjectPlanPayMethod.CDkey) {
    const { project } = await planHelper.upgradeToProByCDKey(body.projectId!, body.cdkey!);

    return ApiUtils.success({
      project
    });
  }

  const { project } = await planHelper.upgradeToProByPay(body.projectId!, {
    ...body,
    cdkey: null
  });

  return ApiUtils.success({
    project
  });
});
