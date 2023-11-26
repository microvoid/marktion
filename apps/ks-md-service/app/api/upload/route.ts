import { NextRequest, NextResponse } from 'next/server';
import { upload } from '@/libs/kcdn';

export const OPTIONS = () =>
  new Response('ok', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file: File | null = formData.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No filed founded.' });
  }

  console.log(`open ${file.name} to see the uploaded file`);

  const { code, data, msg } = await upload([file]);

  if (code !== 0) {
    return NextResponse.json({ success: false, message: msg });
  }

  const url = data.fileResults[0].cdnUrl;

  // return NextResponse.json({ success: true, url });
  return new Response(JSON.stringify({ success: true, url }), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
