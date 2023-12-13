import { useTheme } from 'next-themes';

export function useDarkmode() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return {
    isDarkMode
  };
}
