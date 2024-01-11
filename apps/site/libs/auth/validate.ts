import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { ApiUtils } from '@/libs';

import { luciaAuth } from './LuciaAuth';
import { CodeError } from '../utils/error';

type AuthUserhandlerCtx<T> = {
  user: User;
  params?: T;
};

type AuthUserhandler<T = any> = (req: NextRequest, ctx: AuthUserhandlerCtx<T>) => any;

export function validate<T>(handler: AuthUserhandler<T>) {
  return async (req: NextRequest, routeCtx?: { params: T }) => {
    const user = await getSessionUser();

    if (!user) {
      return ApiUtils.error('Unauthorized');
    }

    try {
      const result = await handler(req, { user, params: routeCtx?.params });

      return result;
    } catch (err) {
      if (err instanceof CodeError) {
        return ApiUtils.error(err.message, err.code);
      }

      return ApiUtils.error('Server Error');
    }
  };
}

export async function getSessionUser(): Promise<User | null> {
  const luciaUser = await luciaAuth.getSessionUser();

  return luciaUser;
}
