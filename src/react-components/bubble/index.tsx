import { Dropdown, Popover, PopoverProps } from 'antd';
import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { bubble } from '../../plugin-bubble';
import { InlineTools } from './inline-tools';

export function Bubble(props: Omit<PopoverProps, 'content'>) {
  return (
    <Popover trigger="click" arrow={false} content={<InlineTools />} {...props}>
      <div style={{ height: '100%' }}></div>
    </Popover>
  );
}

export function useBubble() {
  const [open, setOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl ? createPortal(<Bubble open={open} />, portalEl) : null;

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
