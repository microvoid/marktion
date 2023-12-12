import { DropDownProps, Dropdown, Tag } from 'antd';
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
    [props.detail?.text, props.detail?.state]
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

  useEffect(
    function resetSelectedIndexOnClose() {
      if (!props.open) {
        setSelectedIndex(0);
      }
    },
    [props.open]
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
        style: {
          minWidth: 200
        },
        activeKey: items[selectedIndex]?.key,
        onSelect({ key }) {
          const index = items.findIndex(item => item.title === key);
          onSelectItem(index);
        },
        onKeyDown: e => {
          e.preventDefault();
          e.stopPropagation();
        },
        items: items.map((item, index) => {
          return {
            icon: (
              <div className="slash-item-icon" onClick={() => onSelectItem(index)}>
                {item.icon}
              </div>
            ),
            key: item.key,
            label: (
              <div className="slash-item-caption" onClick={() => onSelectItem(index)}>
                <div className="slash-item-caption-title">
                  {item.title}

                  {item.syntax && (
                    <Tag className="slash-item-caption-syntax" bordered={false}>
                      {item.syntax}
                    </Tag>
                  )}
                </div>
                <div className="slash-item-caption-description">{item.description}</div>
              </div>
            )
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
