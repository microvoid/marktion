import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { Selection } from 'prosemirror-state';

import { AI } from '../../plugin-ai';
import { AIChatPanel, AIChatPanelProps } from './ai-chat-panel';
import { GptConfig } from './type';

export function useAI(gptConfig?: GptConfig) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl
    ? createPortal(
        <AIChatPanel open={open} onOpenChange={setOpen} gptConfig={gptConfig} selection={selection}>
          <div style={{ height: '100%' }}></div>
        </AIChatPanel>,
        portalEl
      )
    : null;

  const plugin = useMemo(() => {
    return AI({
      onAIChatOpenChange(open, selection) {
        setOpen(open);
        setSelection(selection || null);
      },
      onAttachAIChat(protal) {
        setPortalEl(protal);
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
