import { getRepo } from '@/lib/api-github';
import { NextResponse } from 'next/server';

export const GET = async () => {
  return NextResponse.json(await getRepo());
};
