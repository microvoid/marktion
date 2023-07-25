import { useEffect, useState } from 'react';
import { GitHubLogoIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { Tooltip } from 'antd';
import { useDarkMode } from 'usehooks-ts';

export function Header() {
  const { isDarkMode, toggle } = useDarkMode();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTooltipOpen(true);
    }, 2000);
  }, []);

  return (
    <header className="container w-full dark:text-gray-100">
      <div className="flex justify-between items-center h-16">
        <Tooltip open={tooltipOpen} title="Star on Github" placement="right" color="purple">
          <a
            href="https://github.com/microvoid/marktion"
            className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:text-black sm:bottom-auto sm:top-5"
          >
            <GitHubLogoIcon />
          </a>
        </Tooltip>

        <div
          onClick={toggle}
          className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg- hover:text-base sm:bottom-auto sm:top-5"
        >
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
        </div>
      </div>
    </header>
  );
}
