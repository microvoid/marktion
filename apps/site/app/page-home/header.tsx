'use client';

import React, { useEffect, useState } from 'react';
import { GitHubLogoIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Tooltip } from 'antd';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    setTimeout(() => {
      setTooltipOpen(true);
    }, 2000);
  }, []);
  return (
    <header className="w-full p-4  dark:text-gray-100">
      <div className="container flex justify-between items-center h-16 mx-auto">
        <Tooltip open={tooltipOpen} title="Star on Github" placement="right" color="purple">
          <a
            href="https://github.com/microvoid/marktion"
            className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:text-black sm:bottom-auto sm:top-5"
          >
            <GitHubLogoIcon />
          </a>
        </Tooltip>

        <div
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg- hover:text-base sm:bottom-auto sm:top-5"
        >
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
        </div>
      </div>
    </header>
  );
}
