import { useCallback, useEffect, useRef, useState } from 'react';
import { Dropdown, MenuProps, DropDownProps } from 'antd';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { Editor, Range, Extension } from '@tiptap/core';
import { CodeIcon, ListBulletIcon, QuoteIcon, TextIcon, ImageIcon } from '@radix-ui/react-icons';
import { Heading1, Heading2, Heading3, ListChecksIcon, ListOrderedIcon } from 'lucide-react';
import { createIntergrateExtension } from '../plugins';
import { useRootEl } from '../hooks';

interface SuggestionPropsItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export const SlashMenuPlugin = createIntergrateExtension(() => {
  const wrapperElRef: {
    update: (props: SuggestionProps<SuggestionPropsItem> | null) => void;
    setOpen: (open: boolean) => void;
  } = {
    update: () => {},
    setOpen: () => {}
  };

  const suggestion: Omit<SuggestionOptions, 'editor'> = {
    char: '/',
    items: getSuggestionItems,
    render: () => {
      return {
        onStart(props) {
          wrapperElRef.update(props);
          wrapperElRef.setOpen(true);
        },
        onUpdate(props) {
          wrapperElRef.update(props);
        },
        onExit() {
          wrapperElRef.setOpen(false);
          wrapperElRef.update(null);
        },
        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            wrapperElRef.setOpen(false);
            return true;
          }

          if (props.event.key === 'Enter') {
            return true;
          }

          return false;
        }
      };
    },

    command: ({ editor, range, props }) => {
      props.command({ editor, range });
    }
  };

  const SlashExtensions = Extension.create({
    name: 'slash-command',
    addOptions() {
      return {
        suggestion
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion
        })
      ];
    }
  });

  function Wrapper() {
    const [open, setOpen] = useState(false);
    const [props, setProps] = useState<SuggestionProps<SuggestionPropsItem> | null>(null);

    wrapperElRef.update = setProps;
    wrapperElRef.setOpen = setOpen;

    return <SlashDropdown suggestions={props} open={open} onOpenChange={setOpen} />;
  }

  return {
    extension: SlashExtensions,
    view() {
      return <Wrapper />;
    }
  };
});

type SlashDropdownProps = {
  suggestions: SuggestionProps<SuggestionPropsItem> | null;
  open: DropDownProps['open'];
  onOpenChange: DropDownProps['onOpenChange'];
};

function SlashDropdown(props: SlashDropdownProps) {
  const rootEl = useRootEl();

  const triggerElRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { open, onOpenChange } = props;
  const { items = [], command, clientRect } = props.suggestions! || {};

  const rect = clientRect?.();

  useEffect(() => {
    const rootElRect = rootEl?.getBoundingClientRect();

    if (rect && triggerElRef.current) {
      triggerElRef.current.style.top = `${rect.top - rootElRect.top}px`;
      triggerElRef.current.style.left = `${rect.left - rootElRect.left}px`;
      triggerElRef.current.style.width = `${rect.width}px`;
      triggerElRef.current.style.height = `${rect.height}px`;
    }
  }, [rect]);

  useEffect(() => {
    setSelectedIndex(0);

    if (items.length === 0) {
      onOpenChange?.(false);
    }
  }, [items]);

  const onSelectItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item) {
        command(item);
      }
    },
    [command, items]
  );

  useEffect(() => {
    if (!open) return;

    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();

        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === 'Enter') {
          onSelectItem(selectedIndex);
          return true;
        }

        return false;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, items, selectedIndex, setSelectedIndex, onSelectItem]);

  const menuProps: MenuProps = {
    onClick: ({ key }) => {
      const index = items.findIndex(item => item.title === key);
      onSelectItem(index);
    },
    activeKey: items[selectedIndex]?.title,
    items: items.map(item => {
      return {
        disabled: item.disabled,
        icon: item.icon,
        key: item.title,
        label: item.title
      };
    })
  };

  return (
    <Dropdown menu={menuProps} open={open} onOpenChange={onOpenChange} trigger={['click']}>
      <div
        data-role="slash-menu-trigger"
        ref={triggerElRef}
        style={{
          position: 'absolute'
        }}
      ></div>
    </Dropdown>
  );
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

function getSuggestionItems({ query }: { query: string }) {
  return [
    // {
    //   title: 'Continue writing',
    //   description: 'Use AI to expand your thoughts.',
    //   searchTerms: ['gpt']
    //   // icon: <Magic className="w-7 text-black" />,
    // },
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: <TextIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
      }
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: <ListChecksIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      }
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: <Heading1 className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      }
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: <Heading2 className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      }
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: <Heading3 className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      }
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: <ListBulletIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      }
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrderedIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      }
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: <QuoteIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run()
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: <CodeIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      searchTerms: ['photo', 'picture', 'media'],
      disabled: true,
      icon: <ImageIcon className="w-[14px] h-[14px]" />,
      command: ({ editor, range }: CommandProps) => {
        return;

        editor.chain().focus().deleteRange(range).run();
        // upload image
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async event => {
          if (input.files?.length) {
            const file = input.files[0];
            // return handleImageUpload(file, editor.view, event);
          }
        };
        input.click();
      }
    }
  ].filter(item => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
}
