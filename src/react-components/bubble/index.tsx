import { DropDownProps, Dropdown } from 'antd';
import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { bubble } from '../../plugin-bubble';

export function Bubble(props: Omit<DropDownProps, 'menu'>) {
  return (
    <Dropdown
      placement="bottomLeft"
      menu={{
        items: [
          {
            key: 'blockquote',
            label: 'blockquote'
          },
          {
            key: 'heading',
            label: 'heading'
          }
        ]
      }}
      {...props}
    >
      <div style={{ height: '100%' }}></div>
    </Dropdown>
  );
}

export function useBubble() {
  const [open, setOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl
    ? createPortal(<Bubble open={open} onOpenChange={setOpen} />, portalEl)
    : null;

  const plugin = useMemo(() => {
    return bubble({
      onAttach(portal) {
        setPortalEl(portal);
      },
      onOpenChange(open, changeState) {
        setOpen(open);
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
