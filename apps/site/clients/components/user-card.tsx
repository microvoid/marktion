import React, { useEffect } from 'react';
import { Alert, DropdownProps, Popover, Spin } from 'antd';
import Image from 'next/image';
import ANONYMOUS_ICON from '@/public/user-secret-solid.svg';

import { type LoginUser, useLoginUser, useModelModifier, useModelSelector } from '../hooks';

export function UserCard(props: DropdownProps) {
  const user = useLoginUser();

  return (
    <Popover
      trigger={['click']}
      placement="bottomRight"
      arrow={false}
      content={<UserCardContent user={user} />}
    >
      {props.children}
    </Popover>
  );
}

function UserCardContent({ user }: { user: LoginUser }) {
  const modifier = useModelModifier();
  const userStatistics = useModelSelector(ctx => ctx.model.userStatistics);
  const loading = useModelSelector(ctx => ctx.model.userStatisticsLoading);

  useEffect(() => {
    modifier.getUserStatistics();
  }, []);

  return (
    <div className="w-[240px] rounded-md">
      <div className="flex flex-col gap-[7px]">
        <Image className="block h-[60px] w-[60px] rounded-full" src={ANONYMOUS_ICON} alt="user" />
        <div className="flex flex-col gap-[15px]">
          <div>
            <div className="text-mauve12">Anonymouse</div>
            {/* <div className="text-mauve10">@radix_ui</div> */}
          </div>

          {user.anonymous && (
            <Alert
              message="您当前为匿名登陆状态，可能会丢失部分内容，建议登陆后使用"
              type="warning"
            />
          )}

          <Spin spinning={loading}>
            <div className="flex gap-[15px]">
              <div className="flex gap-[5px]">
                <div className="text-mauve12">{userStatistics.postCount}</div>{' '}
                <div className="text-mauve10">Posts</div>
              </div>
              {/* <div className="flex gap-[5px]">
              <div className="text-mauve12">2,900</div>
              <div className="text-mauve10">Followers</div>
            </div> */}
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
}
