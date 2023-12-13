import type { MenuProps, DropdownProps } from 'antd';
import { Dropdown, Tag } from 'antd';
import { SystemShortcutKey, SystemShortcutMap } from './constants';
import { SlashItem, getDefaultSlashItems } from '../slash';

const defaultSlashItems = getDefaultSlashItems().filter(item => item.syntax);

const items: MenuProps['items'] = [
  {
    key: 'system-syntax',
    type: 'group',
    label: 'System Shortcut',
    children: [getSystemMenuItem(SystemShortcutKey.ToggleSourceMode)]
  },
  {
    key: '2',
    type: 'group',
    label: 'Markdown Syntax',
    children: defaultSlashItems.map(getMarkdownShortcurMenuItem)
  }
];

export function HelperMenu(props: Omit<DropdownProps, 'menu'>) {
  const placement = 'leftBottom';

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement={placement as any} {...props}>
      {props.children}
    </Dropdown>
  );
}

function getSystemMenuItem(key: SystemShortcutKey): NonNullable<MenuProps['items']>[number] {
  const item = SystemShortcutMap[key];

  return {
    key: item.key,
    label: (
      <div>
        <Tag bordered={false}>{item.syntax}</Tag>
        {item.title}
      </div>
    )
  };
}

function getMarkdownShortcurMenuItem(item: SlashItem): NonNullable<MenuProps['items']>[number] {
  return {
    key: item.key,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tag bordered={false}>{item.syntax}</Tag>
        {item.title}
      </div>
    )
  };
}
