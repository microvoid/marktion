import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { ApiUtils } from '@/libs';
import { guestAuth } from './GuestAuth';
import { luciaAuth } from './LuciaAuth';
import { CodeError } from '../utils/error';

type AuthUserhandlerCtx<T> = {
  user: User;
  params: T;
};

type AuthUserhandler<T = any> = (req: NextRequest, ctx: AuthUserhandlerCtx<T>) => any;

export function validate<T>(handler: AuthUserhandler<T>) {
  return async (req: NextRequest, { params }: { params: T }) => {
    let { user } = await getSessionUser();

    if (!user) {
      return ApiUtils.error('Unauthorized');
    }

    try {
      const result = await handler(req, { user, params });

      return result;
    } catch (err) {
      if (err instanceof CodeError) {
        return ApiUtils.error(err.message, err.code);
      }

      return ApiUtils.error('Server Error');
    }
  };
}

export async function getSessionUser(): Promise<{ user: User; sessionId: string | null }> {
  const luciaUser = await luciaAuth.getSessionUser();

  if (luciaUser) {
    return {
      user: luciaUser,
      sessionId: null
    };
  }

  return guestAuth.autoGuestSession();
}
