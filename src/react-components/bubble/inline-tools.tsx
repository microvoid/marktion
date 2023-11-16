import { Button } from 'antd';
import { Code, BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { isActive } from '../../core';
import { useEditorState } from '../../react-hooks';

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

export function InlineTools(props: { showAI?: boolean }) {
  const editorState = useEditorState();

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => isActive(editorState, 'strong'),
      command: () => {
        // props.editor.chain().focus().toggleBold().run()
      },
      icon: <BoldIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'italic',
      isActive: () => isActive(editorState, 'em'),
      command: () => {
        // props.editor.chain().focus().toggleItalic().run()
      },
      icon: <ItalicIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'strike',
      isActive: () => isActive(editorState, 'strike'),
      command: () => {
        // props.editor.chain().focus().toggleStrike().run()
      },
      icon: <StrikethroughIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'code',
      isActive: () => isActive(editorState, 'code'),
      command: () => {
        // props.editor.chain().focus().toggleCode().run()
      },
      icon: <Code style={{ width: 14, height: 14 }} />
    }
  ];

  return (
    <>
      {/* {props.showAI && <BubbleAI />} */}

      {items.map(item => {
        return (
          <Button
            key={item.name}
            type={item.isActive() ? 'primary' : 'text'}
            onClick={item.command}
          >
            {item.icon}
          </Button>
        );
      })}
    </>
  );
}
