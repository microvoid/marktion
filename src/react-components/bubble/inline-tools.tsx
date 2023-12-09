import { Button, Divider, Input, InputRef, Popover, PopoverProps, Space } from 'antd';
import { Code, BoldIcon, ItalicIcon, StrikethroughIcon, LinkIcon, TrashIcon } from 'lucide-react';
import { isActive } from '../../core';
import { useEditorState, usePMRenderer } from '../../react-hooks';
import { useRef, useState } from 'react';

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export function InlineTools(props: { showAI?: boolean }) {
  const editorState = useEditorState(true);
  const pmRenderer = usePMRenderer();

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => isActive(editorState, 'strong'),
      command: () => pmRenderer.chain().focus().toggleStrong().run(),
      icon: <BoldIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'italic',
      isActive: () => isActive(editorState, 'em'),
      command: () => pmRenderer.chain().focus().toggleEm().run(),
      icon: <ItalicIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'strike',
      isActive: () => isActive(editorState, 'strike'),
      command: () => pmRenderer.chain().focus().toggleStrike().run(),
      icon: <StrikethroughIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'code',
      isActive: () => isActive(editorState, 'code'),
      command: () => pmRenderer.chain().focus().toggleCode().run(),
      icon: <Code style={{ width: 14, height: 14 }} />
    },
    {
      name: 'link',
      isActive: () => isActive(editorState, 'link'),
      command: () => {
        const selection = pmRenderer.view.state.selection;

        pmRenderer.chain().focus().toggleLink({ href: '' }).run();

        setTimeout(() => {
          pmRenderer
            .chain()
            .setTextSelection(Math.ceil(selection.from + selection.to) / 2)
            .run();
        }, 200);
      },

      icon: <LinkIcon style={{ width: 14, height: 14 }} />
    }
  ];

  return (
    <Space>
      {/* {props.showAI && <BubbleAI />} */}

      {items.map(item => {
        return (
          <Button
            key={item.name}
            type={item.isActive() ? 'primary' : 'text'}
            onClick={item.command}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</div>
          </Button>
        );
      })}
    </Space>
  );
}
