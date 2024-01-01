import { ApiUtils, AuthHelper, fileService } from '@/libs';

export const POST = AuthHelper.validate(async (req, ctx) => {
  const form = await req.formData();

  const projectId = form.get('projectId') as string;
  const filename = form.get('filename') as string;
  const file = form.get('file') as File;

  const buffer = await file.arrayBuffer();
  const result = await fileService.createFile(buffer as Buffer, {
    filename,
    size: file.size,
    userId: ctx.user.id,
    projectId: projectId
  });

  return ApiUtils.success(result);
});
