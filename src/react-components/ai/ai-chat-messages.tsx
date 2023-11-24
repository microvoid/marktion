import { List, Avatar, theme } from 'antd';
import { User2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Message } from 'ai/react';
import { OpenAIIcon } from './icon-openai';
import { ReactSSR } from '../react-ssr';

export function ChatMessages({ messages }: { messages: Message[] }) {
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
                      style={{ backgroundColor: 'transparent', fill: token.colorText }}
                      icon={<OpenAIIcon style={{ width: '100%', height: '100%' }} />}
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
                  avatar={
                    <Avatar
                      size="small"
                      icon={
                        <User2Icon
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      }
                    />
                  }
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
  return <ReactSSR content={str} className="inline-style" innerStyle={{ fontSize: 14 }} />;
}
