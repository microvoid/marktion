import React from 'react';
import { User } from '@prisma/client';
import { useTheme } from 'next-themes';

export type LoginUser = User;

export const LoginUserContext = React.createContext<LoginUser | null>(null);

export function useLoginUser() {
  return React.useContext(LoginUserContext);
}

export function useDarkmode() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return {
    isDarkMode
  };
}
