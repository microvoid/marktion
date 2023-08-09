import { Code } from 'lucide-react';
import { Button, Divider, Input, Popover, InputRef, theme } from 'antd';
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
import { Editor } from '@tiptap/core';

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
  const { token } = theme.useToken();

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
        // setLinkInputOpen(false);
      }
    }
  };

  return (
    <BubbleMenu {...bubbleMenuProps}>
      <div
        className="marktion-plugin-bubble-menu"
        style={{
          paddingTop: token.paddingXS,
          paddingBottom: token.paddingXS,
          paddingLeft: token.paddingSM,
          paddingRight: token.paddingSM,
          borderRadius: token.borderRadius,
          boxShadow: token.boxShadow,
          backgroundColor: token.colorBgElevated
        }}
        onMouseDown={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <InlineTools editor={props.editor} />
      </div>
    </BubbleMenu>
  );
}

export function InlineTools(props: { editor: Editor }) {
  const linkInputRef = useRef<InputRef>(null);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => props.editor.isActive('bold'),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: <FontBoldIcon style={{ width: 14, height: 14 }} />
    },
    {
      name: 'italic',
      isActive: () => props.editor.isActive('italic'),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: <FontItalicIcon style={{ width: 14, height: 14 }} />
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
      icon: <Code style={{ width: 14, height: 14 }} />
    }
  ];

  const link = {
    name: 'link',
    isActive: () => props.editor.isActive('link'),
    command: (href: string) => props.editor.chain().focus().setLink({ href }).run(),
    icon: <Link1Icon style={{ width: 14, height: 14 }} />
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
          style={{
            cursor: 'pointer'
          }}
          onClick={() => {
            props.editor.chain().focus().unsetLink().run();
            setLinkInputOpen(false);
          }}
        />
      }
    />
  );

  return (
    <>
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

      <div
        ref={containerRef}
        style={{ display: 'inline-block' }}
        onMouseDown={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Popover
          arrow={false}
          content={<div style={{ minWidth: 240 }}>{linkInput}</div>}
          placement="bottom"
          open={linkInputOpen}
          onOpenChange={setLinkInputOpen}
          destroyTooltipOnHide={true}
          getPopupContainer={() => containerRef.current || document.body}
          align={{ offset: [8, 10] }}
        >
          <Button key={link.name} type={link.isActive() ? 'primary' : 'text'}>
            {link.icon}
          </Button>
        </Popover>
      </div>
    </>
  );
}
