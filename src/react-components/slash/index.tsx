import { DropDownProps, Dropdown } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { slash } from '../../plugin-slash';
import { getSlashItems } from './getSlashItems';
import { SuggestChangeHandlerProps } from '../../plugin-suggest';
import { usePMRenderer } from '../..';

const items = getSlashItems();

export type SlashProps = {
  changeState?: SuggestChangeHandlerProps;
} & Omit<DropDownProps, 'menu'>;

export function Slash(props: SlashProps) {
  const pmRenderer = usePMRenderer();
  const onSelectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item) {
        item.command(pmRenderer, props.changeState?.range!);
      }
    },
    [props.changeState, items]
  );

  return (
    <Dropdown
      placement="bottomLeft"
      menu={{
        onClick: ({ key }) => {
          const index = items.findIndex(item => item.title === key);
          onSelectItem(index);
        },
        items: items.map(item => {
          return {
            // disabled: item.disabled,
            icon: item.icon,
            key: item.title,
            label: item.title
          };
        })
      }}
      {...props}
    >
      <div style={{ height: '100%' }}></div>
    </Dropdown>
  );
}

export function useSlash() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<SuggestChangeHandlerProps>();
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl
    ? createPortal(<Slash open={open} onOpenChange={setOpen} changeState={detail} />, portalEl)
    : null;

  const plugin = useMemo(() => {
    return slash({
      onAttach(portal) {
        setPortalEl(portal);
      },
      onOpenChange(open, changeState) {
        setOpen(open);
        setDetail(changeState);
      }
    });
  }, []);

  return useMemo(() => {
    return {
      plugin,
      element
    };
  }, [element]);
}
