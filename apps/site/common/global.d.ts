/// <reference types="lucia" />
import { User } from '@prisma/client';

declare namespace Lucia {
  type Auth = import('@/libs/auth').Auth;

  type DatabaseUserAttributes = User;
  type DatabaseSessionAttributes = {};
}
