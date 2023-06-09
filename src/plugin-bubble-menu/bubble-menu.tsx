import { Code } from 'lucide-react';
import { Button, Divider, Input, Popover, Space, InputRef } from 'antd';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  Link1Icon,
  TrashIcon
} from '@radix-ui/react-icons';
import { createIntergrateExtension } from '../plugins';
import { useRef, useState } from 'react';

export const EditorBubbleMenuPlugin = createIntergrateExtension(() => {
  return {
    view(ctx) {
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
  const linkInputRef = useRef<InputRef>(null);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const link = {
    name: 'link',
    isActive: () => props.editor.isActive('link'),
    command: (href: string) => props.editor.chain().focus().setLink({ href }).run(),
    icon: <Link1Icon className="w-[14px] h-[14px]" />
  };

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
        setLinkInputOpen(false);
      }
    }
  };

  const linkInput = (
    <Input
      ref={linkInputRef}
      defaultValue={props.editor.getAttributes('link').href || ''}
      onClick={() => linkInputRef.current?.focus()}
      placeholder="Insert Link"
      addonBefore="https://"
      onPressEnter={e => {
        const url = e.currentTarget.value;

        link.command(url ? `https://${url}` : '');
        setLinkInputOpen(false);
      }}
      addonAfter={
        <TrashIcon
          className="cursor-pointer"
          onClick={() => {
            props.editor.chain().focus().unsetLink().run();
            setLinkInputOpen(false);
          }}
        />
      }
    />
  );

  return (
    <BubbleMenu {...bubbleMenuProps}>
      <Space
        ref={containerRef}
        direction="horizontal"
        className="px-2 py-1 rounded-md relative shadow-lg border bg-white dark:bg-black"
        onMouseDown={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
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
        <Divider type="vertical" />

        <Popover
          arrow={false}
          content={linkInput}
          placement="topRight"
          open={linkInputOpen}
          onOpenChange={setLinkInputOpen}
          destroyTooltipOnHide={true}
          getPopupContainer={() => containerRef.current || document.body}
          align={{ offset: [8, -10] }}
        >
          <Button key={link.name} type={link.isActive() ? 'primary' : 'text'}>
            {link.icon}
          </Button>
        </Popover>
      </Space>
    </BubbleMenu>
  );
}
