import { MenuIcon } from 'lucide-react';
import { Dropdown, Space, type MenuProps, Button } from 'antd';
import { useDarkMode } from 'usehooks-ts';

export function Settings() {
  const { isDarkMode, toggle } = useDarkMode();

  const items: MenuProps['items'] = [
    {
      key: 'Appearance-group',
      label: 'Theme',
      type: 'group',
      children: [
        {
          key: 'dark',
          label: 'dark'
        },
        {
          key: 'light',
          label: 'light'
        }
      ]
    }
  ];

  const selectedKeys: string[] = [];

  if (isDarkMode) {
    selectedKeys.push('dark');
  } else {
    selectedKeys.push('light');
  }

  return (
    <div>
      <Dropdown
        trigger={['click']}
        menu={{
          items,
          selectable: true,
          selectedKeys,
          style: { minWidth: 200 },
          onSelect({ selectedKeys }) {
            if (selectedKeys.includes('dark') || selectedKeys.includes('light')) {
              toggle();
            }
          }
        }}
        placement="bottomRight"
      >
        <Space>
          <Button icon={<MenuIcon width={14} height={14} />}></Button>
        </Space>
      </Dropdown>
    </div>
  );
}
