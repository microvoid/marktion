'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Tooltip } from 'antd';
import { UserCard } from './user-card';
import { Icon } from './icon';
import { UpgradeToPro } from './upgrade-to-pro';
import { DarkModeBtn } from './setting-dark-mode-btn';

export function Header() {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTooltipOpen(true);
    }, 2000);
  }, []);

  return (
    <header className="dark:text-gray-100">
      <div className="flex justify-between items-center h-16 mx-auto">
        <Tooltip open={tooltipOpen} title="Star on Github" placement="right" color="purple">
          <a
            href="https://github.com/microvoid/marktion"
            className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:bg-stone-700 sm:bottom-auto sm:top-5"
          >
            {/* <GithubIcon size={18} /> */}
            <Icon name="github" size={18} />
          </a>
        </Tooltip>

        <div className="flex items-center rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg- hover:text-base sm:bottom-auto sm:top-5">
          <Tag color="magenta" onClick={() => setUpgradeModalOpen(true)}>
            Upgrade to Pro
          </Tag>

          <UserCard>
            <button className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:bg-stone-700 sm:bottom-auto sm:top-5">
              <Icon name="user" size={18} />
            </button>
          </UserCard>

          <DarkModeBtn />
        </div>
      </div>

      <UpgradeToPro
        open={upgradeModalOpen}
        onOk={() => setUpgradeModalOpen(false)}
        onCancel={() => setUpgradeModalOpen(false)}
      />
    </header>
  );
}
