import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { slash } from '../../plugin-slash';
import { Slash } from './slash';
import { SuggestionProps } from '../../plugin-suggestion';

export function useSlash() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<SuggestionProps | null>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl
    ? createPortal(<Slash open={open} onOpenChange={setOpen} detail={detail} />, portalEl)
    : null;

  const plugin = useMemo(() => {
    return slash({
      char: '/',
      onChange(open, props) {
        setOpen(open);
        setDetail(props);
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
