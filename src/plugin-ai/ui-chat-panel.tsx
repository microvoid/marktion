import { PopoverProps, Popover, Input, InputRef, Button, List, Avatar, theme } from 'antd';
import { BotIcon, SparklesIcon, User2Icon, SendHorizonalIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useChat, Message } from 'ai/react';
import { GptOptions } from './api';
import { parse } from '../plugin-markdown';

type ChatPanelProps = PopoverProps & { gptConfig: GptOptions['config'] };

export function ChatPanel({ children, gptConfig, ...popoverProps }: ChatPanelProps) {
  const inputRef = useRef<InputRef>(null);
  const { token } = theme.useToken();

  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat({
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
    inputRef.current?.focus();
  }, [popoverProps.open]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        popoverProps.onOpenChange?.(false);
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [popoverProps.onOpenChange]);

  const onSubmit = (e: any) => {
    if (isComposingInput) return;

    handleSubmit(e);
  };

  const inputEl = (
    <Input
      autoFocus
      value={input}
      disabled={isLoading}
      ref={inputRef}
      prefix={
        <SparklesIcon
          style={{
            marginRight: token.marginXS,
            color: token.purple
          }}
        />
      }
      suffix={
        <Button loading={isLoading} icon={<SendHorizonalIcon fontSize={14} />} onClick={onSubmit} />
      }
      placeholder="OpenAI GPT-3 Playground"
      bordered={false}
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
        <div style={{ padding: token.paddingXS }}>{inputEl}</div>
      </>
    );
  };

  const content = (
    <div
      style={{
        width: 450
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

function ChatMessages({ messages }: { messages: Message[] }) {
  const root = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();

  useEffect(() => {
    root.current?.scrollTo({
      top: root.current.scrollHeight
    });
  }, [messages]);

  return (
    <div
      style={{
        maxHeight: 300,
        padding: token.paddingXS,
        overflow: 'auto'
      }}
      ref={root}
    >
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => {
          if (item.role === 'assistant') {
            return (
              <List.Item key={item.id} id={item.id}>
                <List.Item.Meta
                  style={{
                    alignItems: 'center'
                  }}
                  avatar={
                    <Avatar
                      size="small"
                      style={{ backgroundColor: 'var(--mp-foreground)', color: '#FFFFFF' }}
                      icon={<BotIcon style={{ width: '100%', height: '100%' }} />}
                    />
                  }
                  description={renderContent(item.content)}
                />
              </List.Item>
            );
          } else {
            return (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar size="small" icon={<User2Icon className="w-full h-full" />} />}
                  description={item.content}
                />
              </List.Item>
            );
          }
        }}
      />
    </div>
  );
}

function renderContent(str: string) {
  const html = parse(str);

  return <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: html }}></div>;
}
