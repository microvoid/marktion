import { Dropdown } from 'antd';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SlashEvent, SlashPluginKey } from '../../plugin-slash';
import { usePlugin, usePortal } from '../../react-hooks';

export function SlashPlugin() {
  const slashPortal = usePortal(SlashPluginKey)!;
  const slash = usePlugin(SlashPluginKey);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpenChange = (payload: SlashEvent['onOpenChange']) => {
      setOpen(payload.open);
    };

    slash.event.on('onOpenChange', onOpenChange);

    return () => {
      slash.event.off('onOpenChange', onOpenChange);
    };
  }, [slash]);

  if (!slashPortal) {
    return null;
  }

  return createPortal(
    <Dropdown
      open={open}
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
    >
      <div style={{ height: '100%' }}></div>
    </Dropdown>,
    slashPortal
  );
}
