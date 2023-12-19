import { ApiUtils, AuthHelper, fileService } from '@/libs';

export const POST = AuthHelper.validate(async (req, ctx) => {
  const form = await req.formData();

  const filename = form.get('filename') as string;
  const file = form.get('file') as File;

  const buffer = await file.arrayBuffer();
  const result = await fileService.createFile(buffer as Buffer, {
    filename,
    size: file.size,
    userId: ctx.user.id,
    projectId: null
  });

  return ApiUtils.success(result);
});
