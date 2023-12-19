/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('@/libs/auth').Auth;

  type DatabaseUserAttributes = {
    name: string;
    email?: string;
    avatar: string;
    anonymous: boolean;
  };

  type DatabaseSessionAttributes = {};
}
