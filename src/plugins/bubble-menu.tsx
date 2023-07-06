import { Code } from 'lucide-react';
import { Button, Space } from 'antd';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { FontBoldIcon, FontItalicIcon, StrikethroughIcon } from '@radix-ui/react-icons';
import { createIntergrateExtension } from '../plugins';

export const EditorBubbleMenuPlugin = createIntergrateExtension(ctx => {
  return {
    view() {
      return <EditorBubbleMenu editor={ctx.editor} />;
    }
  };
});

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'>;

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: React.ReactNode;
}

function EditorBubbleMenu(props: EditorBubbleMenuProps) {
  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => props.editor.isActive('bold'),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: <FontBoldIcon className="w-[14px] h-[14px]" />
    },
    {
      name: 'italic',
      isActive: () => props.editor.isActive('italic'),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: <FontItalicIcon />
    },
    {
      name: 'strike',
      isActive: () => props.editor.isActive('strike'),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: <StrikethroughIcon />
    },
    {
      name: 'code',
      isActive: () => props.editor.isActive('code'),
      command: () => props.editor.chain().focus().toggleCode().run(),
      icon: <Code className="w-[14px] h-[14px]" />
    }
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      // don't show if image is selected
      if (editor.isActive('image')) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: 'transform 0.15s ease-out',
      onHidden: () => {}
    }
  };

  return (
    <BubbleMenu {...bubbleMenuProps}>
      <Space
        direction="horizontal"
        className="px-2 py-1 rounded-md relative shadow-lg border bg-white dark:bg-black"
        onMouseDown={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {items.map(item => {
          return (
            <Button type={item.isActive() ? 'primary' : 'text'} onClick={item.command}>
              {item.icon}
            </Button>
          );
        })}
      </Space>
    </BubbleMenu>
  );
}
