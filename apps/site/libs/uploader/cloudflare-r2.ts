import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudflareR2Constants } from '@/libs';
import * as path from 'path';
import { nanoid } from 'nanoid';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${CloudflareR2Constants.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CloudflareR2Constants.R2_ACCESS_KEY_ID || '',
    secretAccessKey: CloudflareR2Constants.R2_SECRET_ACCESS_KEY || ''
  }
});

export async function uploadR2(filename: string, file: Buffer, basePath = 'static/uploaded/') {
  const Key = basePath + `${nanoid()}${path.extname(filename)}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: CloudflareR2Constants.R2_BUCKET_NAME,
      Body: file,
      Key
    })
  );

  return `https://cdn.marktion.io/${Key}`;
}
