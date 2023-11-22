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

      <Divider type="vertical" />

      <LinkTool />
    </Space>
  );
}

const defaultPopoverAlign: PopoverProps['align'] = { offset: [0, 10] };

function LinkTool() {
  const editorState = useEditorState(true);
  const pmRenderer = usePMRenderer();
  const linkInputRef = useRef<InputRef>(null);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const link = {
    name: 'link',
    isActive: () => isActive(editorState, 'link'),
    command: (href: string) => pmRenderer.chain().focus().setLink({ href }).run(),
    icon: <LinkIcon style={{ width: 14, height: 14 }} />
  };

  const linkInput = (
    <Input
      ref={linkInputRef}
      defaultValue={pmRenderer.getAttributes('link').href || ''}
      onClick={() => linkInputRef.current?.focus()}
      placeholder="Insert Link"
      onPressEnter={e => {
        const url = e.currentTarget.value;

        link.command(url ? `https://${url}` : '');
        setLinkInputOpen(false);
      }}
      addonAfter={
        <TrashIcon
          style={{
            width: 14,
            height: 14,
            cursor: 'pointer'
          }}
          onClick={() => {
            pmRenderer.chain().focus().unsetLink().run();
            setLinkInputOpen(false);
          }}
        />
      }
    />
  );

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-block' }}
      onMouseDown={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Popover
        content={<div style={{ minWidth: 240 }}>{linkInput}</div>}
        placement="bottom"
        align={defaultPopoverAlign}
        open={linkInputOpen}
        onOpenChange={setLinkInputOpen}
        destroyTooltipOnHide={true}
        getPopupContainer={() => containerRef.current || document.body}
      >
        <Button key={link.name} type={link.isActive() ? 'primary' : 'text'}>
          {link.icon}
        </Button>
      </Popover>
    </div>
  );
}
