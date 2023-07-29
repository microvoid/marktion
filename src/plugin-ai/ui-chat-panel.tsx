import { PopoverProps, Popover, Input, InputRef, Button, List, Avatar } from 'antd';
import { BotIcon, SparklesIcon, User2Icon } from 'lucide-react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import { Message, useChat } from './useChat';
import { GptOptions } from './api';

type ChatPanelProps = PopoverProps & { gptConfig: GptOptions['config'] };

export function ChatPanel({ children, gptConfig, ...popoverProps }: ChatPanelProps) {
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useState('');
  const { loading, submit, messages } = useChat(gptConfig);

  useEffect(() => {
    inputRef.current?.focus();
  }, [popoverProps.open]);

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

  const input = (
    <Input
      autoFocus
      value={inputValue}
      disabled={loading}
      ref={inputRef}
      prefix={<SparklesIcon className="w-[14px] h-[14px] text-purple-600 mr-2" />}
      suffix={
        <Button
          icon={<PaperPlaneIcon className="inline-block mt-[-2px]" />}
          onClick={() => submit(inputValue)}
        />
      }
      placeholder="OpenAI GPT-3 Playground"
      bordered={false}
      onChange={e => setInputValue(e.currentTarget.value)}
      onPressEnter={() => submit(inputValue)}
    />
  );

  const renderInputMode = () => {
    return (
      <div className="w-[450px]">
        <div className="p-2">{input}</div>
      </div>
    );
  };

  const renderChatMode = () => {
    return (
      <div className="w-[450px]">
        <div className="p-2 border-b">
          <ChatMessages messages={messages} />
        </div>
        <div className="p-2">{input}</div>
      </div>
    );
  };

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      arrow={false}
      overlayInnerStyle={{
        padding: 0
      }}
      {...popoverProps}
      content={messages.length > 0 ? renderChatMode() : renderInputMode()}
    >
      {children}
    </Popover>
  );
}

function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="max-h-[300px] overflow-auto">
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => {
          const content = item.choices[0];

          if (!content) return null;

          if (content.delta.role === 'assistant') {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<BotIcon className="w-full h-full" />}
                      style={{ backgroundColor: 'cyan', color: '#fff' }}
                    />
                  }
                  description={item.choices[0].delta.content}
                />
              </List.Item>
            );
          } else {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<User2Icon className="w-full h-full" />}
                      style={{ backgroundColor: 'green', color: '#fff' }}
                    />
                  }
                  description={item.choices[0].delta.content}
                />
              </List.Item>
            );
          }
        }}
      />
    </div>
  );
}
