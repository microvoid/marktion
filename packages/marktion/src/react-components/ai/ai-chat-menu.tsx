import { Dropdown, type DropDownProps } from 'antd';

export type ChatMenuProps = DropDownProps & { onSelectMenu: (key: ChatMenuKey) => void };

export enum ChatMenuKey {
  InsertToContent = 'InsertToContent'
}

export function ChatMenu({ onSelectMenu, children, ...dropdownProps }: ChatMenuProps) {
  return (
    <Dropdown
      forceRender
      trigger={['click']}
      overlayStyle={{
        minWidth: 0
      }}
      {...dropdownProps}
      menu={{
        onClick(e) {
          onSelectMenu(e.key as ChatMenuKey);
        },
        items: [
          {
            key: ChatMenuKey.InsertToContent,
            label: '插入正文'
          }
        ]
      }}
    >
      {children}
    </Dropdown>
  );
}
