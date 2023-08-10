import {
  PopoverProps,
  Popover,
  Input,
  InputRef,
  Button,
  List,
  Avatar,
  theme,
  Dropdown,
  DropDownProps
} from 'antd';
import { SparklesIcon, User2Icon, SendHorizonalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat, Message } from 'ai/react';
import { GptOptions } from './api';
import { MarktionSSR } from '..';
import { OpenAIIcon } from './icon-openai';
import { useEditor } from '../hooks';

export type ChatPanelProps = PopoverProps & {
  gptConfig: GptOptions['config'];
};

export function ChatPanel({ children, gptConfig, ...popoverProps }: ChatPanelProps) {
  const inputRef = useRef<InputRef>(null);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const chatMenuWrapperRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const editor = useEditor();

  const { messages, input, isLoading, handleInputChange, handleSubmit, setMessages, stop } =
    useChat({
      // initialMessages: DEBUG_MESSAGE,
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

    if (!popoverProps.open) {
      setMessages([]);
      stop();
    }
  }, [popoverProps.open]);

  useEffect(() => {
    if (!popoverProps.open) {
      setChatMenuOpen(false);
      return;
    }

    if (messages.length > 0) {
      setChatMenuOpen(true);
    }
  }, [messages.length > 0, popoverProps.open, isLoading]);

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

  const onSubmit = (e?: React.KeyboardEvent) => {
    if (isComposingInput) return;
    if (e?.shiftKey) return;

    handleSubmit(e as any);
  };

  const onSelectMenu: ChatMenuProps['onSelectMenu'] = useCallback(
    key => {
      if (key === ChatMenuKey.InsertToContent) {
        popoverProps.onOpenChange?.(false);

        const markdown = messagesToMarkdown(messages);
        editor.chain().focus().insertMarkdownAt(editor.state.selection, markdown).run();
      }
    },
    [editor, messages]
  );

  const inputEl = (
    <Input
      autoFocus
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
          icon={<SendHorizonalIcon fontSize={14} />}
          onClick={() => onSubmit()}
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

export enum ChatMenuKey {
  InsertToContent = 'InsertToContent'
}

type ChatMenuProps = DropDownProps & { onSelectMenu: (key: ChatMenuKey) => void };

function ChatMenu({ onSelectMenu, children, ...dropdownProps }: ChatMenuProps) {
  return (
    <Dropdown
      forceRender
      trigger={['click']}
      overlayStyle={{
        minWidth: 0
      }}
      {...dropdownProps}
      menu={{
        onClick(e) {
          onSelectMenu(e.key as ChatMenuKey);
        },
        items: [
          {
            key: ChatMenuKey.InsertToContent,
            label: '插入正文'
          }
        ]
      }}
    >
      {children}
    </Dropdown>
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
  return <MarktionSSR markdown={str} className="inline-style" innerStyle={{ fontSize: 14 }} />;
}

const DEBUG_MESSAGE: Message[] = [
  {
    content: '你好',
    role: 'user',
    id: 'bEWVuuR'
  },
  {
    id: '8E4w1pz',
    content: '你好! 我是AI语言模型，有什么可以帮助您的吗？',
    role: 'assistant'
  },
  {
    content: '使用 TS 编写二分查找并解释',
    role: 'user',
    id: 'BDv0BBt'
  },
  {
    id: 'xqmdBiD',
    content:
      '二分查找（Binary Search）是一种高效的查找算法，也称为折半查找。该算法的实现需要数据排好序，它首先在数组中间查找元素，如果这个元素不是要查找的元素，那么就根据大小关系可以排除数组的一半，再在剩下一半的元素中查找，依此类推，直到找到要查找的元素或者确定该元素不存在为止。\n\n以下是用 TypeScript 实现二分查找的代码示例:\n\n```typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] > target) {\n      right = mid - 1;\n    } else {\n      left = mid + 1;\n    }\n  }\n  return -1;\n}\n```\n\n该函数接收两个参数，一个已排序的数字数组 `arr`，和要查找的目标数字 `target`。变量 `left` 和 `right` 分别为已排序数组的左右边界，初始化 `left` 为0， `right` 为 `arr.length-1`。接下来就是一个循环，根据中间元素与目标数字的大小关系，不断缩小范围。如果找到目标数字，函数返回它出现的下标，否则返回 -1。\n\n以上就是二分查找算法的 TypeScript 实现及其解释。',
    role: 'assistant'
  },
  {
    content: '使用 TS 编写二分查找并解释',
    role: 'user',
    id: 'BDv0BBt'
  },
  {
    id: 'xqmdBiD',
    content:
      '二分查找（Binary Search）是一种高效的查找算法，也称为折半查找。该算法的实现需要数据排好序，它首先在数组中间查找元素，如果这个元素不是要查找的元素，那么就根据大小关系可以排除数组的一半，再在剩下一半的元素中查找，依此类推，直到找到要查找的元素或者确定该元素不存在为止。\n\n以下是用 TypeScript 实现二分查找的代码示例:\n\n```typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] > target) {\n      right = mid - 1;\n    } else {\n      left = mid + 1;\n    }\n  }\n  return -1;\n}\n```\n\n该函数接收两个参数，一个已排序的数字数组 `arr`，和要查找的目标数字 `target`。变量 `left` 和 `right` 分别为已排序数组的左右边界，初始化 `left` 为0， `right` 为 `arr.length-1`。接下来就是一个循环，根据中间元素与目标数字的大小关系，不断缩小范围。如果找到目标数字，函数返回它出现的下标，否则返回 -1。\n\n以上就是二分查找算法的 TypeScript 实现及其解释。',
    role: 'assistant'
  },
  {
    content: '编写 Javascript 入门 文档大纲',
    role: 'user',
    id: 'ECTry5L'
  },
  {
    id: '8oqGiR5',
    content:
      '下面是一份Javascript入门文档的大纲，供参考：\n\n## 1. 前言\n- 什么是Javascript？\n- Javascript的历史和版本\n- 为什么学习Javascript？\n\n## 2. 基础语法\n- 认识Javascript注释\n- 声明变量\n- 数据类型\n    - 字符串\n    - 数字\n    - 布尔值\n    - undefined\n    - null\n    - 对象\n    - 数组\n- 运算符\n- 常见的流程控制语句\n    - if语句\n    - switch语句\n    - for语句\n    - while语句\n    - do-while语句\n\n## 3. 函数\n- 学习什么是函数\n- 如何定义一个函数\n- 学习函数返回值\n- 函数的参数\n    - 有参数函数\n    - 无参数函数\n    - 默认参数\n    - 剩余参数\n\n## 4. 对象和数组\n- 学习Javascript中的对象\n    - 什么是对象\n    - 定义对象\n    - 访问对象的属性\n    - 删除对象的属性\n    - 对象中方法的调用\n- 学习Javascript中的数组\n    - 什么是数组\n    - 如何定义数组\n    - 如何访问数组的元素\n    - 其他有用的数组方法\n\n## 5. DOM操作\n- 认识DOM\n- 如何获取DOM元素\n- 如何操作DOM元素\n- 认识事件\n- 如何处理事件\n\n## 6. 异步请求\n- 如何发起异步请求\n- 如何处理异步请求返回的数据\n\n## 7. 模块化编程\n- 什么是模块化编程\n- 如何使用ES6模块\n- 如何使用CommonJS模块\n\n## 8. JavaScript框架和库\n- JQuery 简介（选学）\n- Vue.js 简介（选学）\n- React 简介（选学）\n\n## 9. 最佳实践\n- 学习 JavaScript 开发规范\n- 代码注释\n- 编写可读性高的代码\n\n## 10. 总结\n- 对JavaScript有了全面的认识\n- 为何要多练习\n- 推荐一些优秀的学习素材\n\n以上是Javascript入门文档的大纲，希望对你有所帮助！',
    role: 'assistant'
  }
];
