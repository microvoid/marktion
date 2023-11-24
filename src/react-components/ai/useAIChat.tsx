import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { AI } from '../../plugin-ai';
import { AIChatPanel } from './ai-chat-panel';
import { GptOptions } from './type';

export function useAI(gptConfig?: GptOptions['config']) {
  const [open, setOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const element = portalEl
    ? createPortal(
        <AIChatPanel open={open} onOpenChange={setOpen} gptConfig={gptConfig}>
          <div style={{ height: '100%' }}></div>
        </AIChatPanel>,
        portalEl
      )
    : null;

  const plugin = useMemo(() => {
    return AI({
      onAIChatOpenChange(open) {
        setOpen(open);
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
