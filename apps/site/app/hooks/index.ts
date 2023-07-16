import React from 'react';
import { User } from '@prisma/client';

export type LoginUser = User;

export const LoginUserContext = React.createContext<LoginUser | null>(null);

export function useLoginUser() {
  return React.useContext(LoginUserContext);
}
