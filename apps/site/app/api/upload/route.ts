import { AuthHandler, uploadR2 } from '@/libs';

export const POST = AuthHandler.validate(async (req, ctx) => {
  const form = await req.formData();

  const filename = form.get('filename') as string;
  const file = form.get('file') as File;

  const buffer = await file.arrayBuffer();
  const url = await uploadR2(filename, buffer as Buffer);

  return AuthHandler.success({
    url
  });
});
