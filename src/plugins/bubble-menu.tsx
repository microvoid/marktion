import { useState } from 'react';
import { Code } from 'lucide-react';
import { Button } from 'antd';
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
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => props.editor.isActive('bold'),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: <FontBoldIcon />
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
      onHidden: () => {
        setIsNodeSelectorOpen(false);
        setIsColorSelectorOpen(false);
        setIsLinkSelectorOpen(false);
      }
    }
  };

  return (
    <BubbleMenu
      className="flex p-2 divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
      {...bubbleMenuProps}
    >
      {items.map(item => {
        return <Button type={item.isActive() ? 'primary' : 'ghost'} icon={item.icon} />;
      })}
    </BubbleMenu>
  );
}
