import { User } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { GUEST_SESSION_ID } from '@/common';

import { userService } from './services';

type AuthUserhandlerCtx<T> = {
  user: User;
  params: T;
};

type AuthUserhandler<T = any> = (req: NextRequest, ctx: AuthUserhandlerCtx<T>) => any;

export function validate<T>(handler: AuthUserhandler<T>) {
  return async (req: NextRequest, { params }: { params: T }) => {
    const user = await isAuthorized();

    if (!user) {
      return error('Unauthorized');
    }

    return handler(req, { user, params });
  };
}

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

export async function isAuthorized() {
  const cookieStore = cookies();
  const guestCookie = cookieStore.get(GUEST_SESSION_ID);

  if (guestCookie?.value) {
    const guest = await userService.getUser(guestCookie?.value);
    return guest;
  }

  return null;
}

export async function autoGuestAuth() {
  const guest = await isAuthorized();

  if (guest) {
    return guest;
  }

  return userService.createGuest();
}
