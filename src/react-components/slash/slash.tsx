import { DropDownProps, Dropdown } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getSlashItems } from './getSlashItems';
import { usePMRenderer } from '../../react-hooks';
import { SuggestionProps } from '../../plugin-suggestion';

export type SlashProps = {
  detail: SuggestionProps | null;
} & Omit<DropDownProps, 'menu'>;

export function Slash(props: SlashProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pmRenderer = usePMRenderer();

  const items = useMemo(
    () => getSlashItems(props.detail?.text!, props.detail?.state!),
    [props.detail?.text]
  );

  const onSelectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item) {
        item.command(pmRenderer, props.detail?.range!);
        setSelectedIndex(0);
      }
    },
    [props.detail, items]
  );

  useEffect(() => {
    if (!props.open) return;

    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();

        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === 'Enter') {
          onSelectItem(selectedIndex);
          return true;
        }

        return false;
      }
    };

    document.addEventListener('keydown', onKeyDown, {
      capture: true
    });
    return () => {
      document.removeEventListener('keydown', onKeyDown, {
        capture: true
      });
    };
  }, [props.open, items, selectedIndex, setSelectedIndex, onSelectItem]);

  const open = items.length > 0 ? props.open : false;

  return (
    <Dropdown
      placement="bottomLeft"
      trigger={['click']}
      menu={{
        activeKey: items[selectedIndex]?.title,
        onClick: ({ key }) => {
          const index = items.findIndex(item => item.title === key);
          onSelectItem(index);
        },
        items: items.map(item => {
          return {
            icon: item.icon,
            key: item.title,
            label: item.title
          };
        })
      }}
      {...props}
      open={open}
    >
      <div style={{ height: '100%' }}></div>
    </Dropdown>
  );
}
