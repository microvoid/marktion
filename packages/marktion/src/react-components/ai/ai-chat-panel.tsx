import { useChat, Message } from 'ai/react';
import { Selection } from 'prosemirror-state';
import { SparklesIcon, SendHorizonalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PopoverProps, Popover, Input, InputRef, Button, theme } from 'antd';

import { GptOptions } from './type';
import { DEBUG_MESSAGE } from './DEBUG_utils';
import { usePMRenderer } from '../../react-hooks';
import { ChatMessages } from './ai-chat-messages';
import { ChatMenu, ChatMenuKey, ChatMenuProps } from './ai-chat-menu';
import { insertMessages } from './helper';

export type AIChatPanelProps = PopoverProps & {
  gptConfig: GptOptions['config'];
  selection: Selection | null;
};

// const defaultInitialMessages = DEBUG_MESSAGE;
const defaultInitialMessages: Message[] = [];

export function AIChatPanel({ children, gptConfig, selection, ...popoverProps }: AIChatPanelProps) {
  const inputRef = useRef<InputRef>(null);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const chatMenuWrapperRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const pm = usePMRenderer();

  const { messages, input, isLoading, handleInputChange, handleSubmit, setMessages, stop } =
    useChat({
      initialMessages: defaultInitialMessages,
      api: `${gptConfig?.basePath}/chat/completions`,
      body: {
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
        model: 'gpt-3.5-turbo'
      },
      headers: {
        Authorization: `Bearer ${gptConfig?.apiKey}`
      }
    });

  const [isComposingInput, setIsComposingInput] = useState(false);

  useEffect(() => {
    if (!popoverProps.open) {
      setMessages(defaultInitialMessages);
      stop();
    } else {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [popoverProps.open]);

  useEffect(() => {
    if (!popoverProps.open) {
      setChatMenuOpen(false);
      return;
    }

    if (messages.length >= 2) {
      setChatMenuOpen(true);
    }
  }, [messages.length >= 2, popoverProps.open, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        popoverProps.onOpenChange?.(false);
        pm.focus();
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [popoverProps.onOpenChange]);

  const onSubmit = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (isComposingInput) return;
    if (e?.shiftKey) return;

    handleSubmit(e as any);
  };

  const onSelectMenu: ChatMenuProps['onSelectMenu'] = useCallback(
    key => {
      if (key === ChatMenuKey.InsertToContent) {
        popoverProps.onOpenChange?.(false);
        insertMessages(pm, messages, selection);
      }
    },
    [pm, messages]
  );

  const inputEl = (
    <Input
      style={{ boxShadow: 'none' }}
      bordered={false}
      value={input}
      disabled={isLoading}
      ref={inputRef}
      prefix={
        <SparklesIcon
          onClick={() => setChatMenuOpen(!chatMenuOpen)}
          style={{
            cursor: 'pointer',
            marginRight: token.marginXS,
            color: token.purple
          }}
        />
      }
      suffix={
        <Button
          loading={isLoading}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          icon={<SendHorizonalIcon width={16} height={16} />}
          onClick={onSubmit}
        />
      }
      placeholder="OpenAI GPT-3 Playground"
      onChange={handleInputChange}
      onPressEnter={onSubmit}
      onCompositionStart={() => setIsComposingInput(true)}
      onCompositionEnd={() => setIsComposingInput(false)}
    />
  );

  const renderInputMode = () => {
    return <div style={{ padding: token.paddingXS }}>{inputEl}</div>;
  };

  const renderChatMode = () => {
    return (
      <>
        <div style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <ChatMessages messages={messages} />
        </div>
        <div ref={chatMenuWrapperRef} style={{ position: 'relative' }}>
          <ChatMenu
            open={chatMenuOpen}
            onSelectMenu={onSelectMenu}
            getPopupContainer={() => chatMenuWrapperRef.current || document.body}
          >
            <div style={{ padding: token.paddingXS }}>{inputEl}</div>
          </ChatMenu>
        </div>
      </>
    );
  };

  const content = (
    <div
      style={{
        width: 600
      }}
      onWheel={e => {
        e.stopPropagation();
      }}
    >
      {messages.length > 0 ? renderChatMode() : renderInputMode()}
    </div>
  );

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      arrow={false}
      overlayInnerStyle={{
        padding: 0
      }}
      {...popoverProps}
      content={content}
    >
      {children}
    </Popover>
  );
}

function messagesToMarkdown(messages: Message[]) {
  return messages
    .map(message => {
      if (message.role === 'assistant') {
        return message.content;
      }

      return `**Q: ${message.content}**`;
    })
    .join('\n\n');
}
