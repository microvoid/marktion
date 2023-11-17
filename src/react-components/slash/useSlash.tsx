import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { Range } from '../../core';
import { slash } from '../../plugin-slash';
import { Slash } from './slash';

export function useSlash() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<Range | null>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl
    ? createPortal(<Slash open={open} onOpenChange={setOpen} range={range} />, portalEl)
    : null;

  const plugin = useMemo(() => {
    return slash({
      char: '/',
      onChange(open, props) {
        setOpen(open);
        setRange(props.range);
      },
      onAttach(portal) {
        setPortalEl(portal);
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
