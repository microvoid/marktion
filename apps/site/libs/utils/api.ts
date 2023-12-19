import { NextResponse } from 'next/server';

export function success(data: any) {
  return NextResponse.json({
    data,
    status: 0
  });
}

export function error(message: string, code = -1) {
  return NextResponse.json({
    message,
    status: code
  });
}
