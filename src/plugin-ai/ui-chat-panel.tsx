import { PopoverProps, Popover, Input, InputRef, Button, List, Avatar } from 'antd';
import { BotIcon, SparklesIcon, User2Icon } from 'lucide-react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import { useChat, Message } from 'ai/react';
import { GptOptions } from './api';
import { parse } from '../plugin-markdown';

type ChatPanelProps = PopoverProps & { gptConfig: GptOptions['config'] };

export function ChatPanel({ children, gptConfig, ...popoverProps }: ChatPanelProps) {
  const inputRef = useRef<InputRef>(null);
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
      prefix={<SparklesIcon className="w-[14px] h-[14px] text-purple-600 mr-2" />}
      suffix={
        <Button
          loading={isLoading}
          icon={<PaperPlaneIcon className="inline-block mt-[-2px]" />}
          onClick={onSubmit}
        />
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
    return <div className="p-2">{inputEl}</div>;
  };

  const renderChatMode = () => {
    return (
      <>
        <div className="border-b">
          <ChatMessages messages={messages} />
        </div>
        <div className="p-2">{inputEl}</div>
      </>
    );
  };

  const content = (
    <div
      className="w-[450px]"
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

  useEffect(() => {
    root.current?.scrollTo({
      top: root.current.scrollHeight
    });
  }, [messages]);

  return (
    <div className="max-h-[300px] p-2 overflow-auto" ref={root}>
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => {
          if (item.role === 'assistant') {
            return (
              <List.Item key={item.id} id={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size="small"
                      style={{ backgroundColor: 'var(--mp-foreground)', color: '#FFFFFF' }}
                      icon={<BotIcon className="w-full h-full" />}
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
