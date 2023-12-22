import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { ApiUtils } from '@/libs';
import { guestAuth } from './GuestAuth';
import { luciaAuth } from './LuciaAuth';

type AuthUserhandlerCtx<T> = {
  user: User;
  params: T;
};

type AuthUserhandler<T = any> = (req: NextRequest, ctx: AuthUserhandlerCtx<T>) => any;

export function validate<T>(handler: AuthUserhandler<T>) {
  return async (req: NextRequest, { params }: { params: T }) => {
    let user: User | null = await getSessionUser();

    if (!user) {
      return ApiUtils.error('Unauthorized');
    }

    return handler(req, { user, params });
  };
}

export async function getSessionUser(): Promise<User> {
  const luciaUser = await luciaAuth.getSessionUser();

  if (luciaUser) {
    return luciaUser;
  }

  return guestAuth.autoGuest();
}
