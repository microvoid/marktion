import { useCallback, useEffect, useRef, useState } from 'react';
import { Dropdown, MenuProps, DropDownProps } from 'antd';
import Suggestion, { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { Extension } from '@tiptap/react';
import { useRootElRef } from '../hooks';
import { getSuggestionItems } from './suggestions';
import { createIntergrateExtension } from '../plugins';

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
    trigger: 'keyboard' | 'other';
  } = {
    update: () => {},
    setOpen: () => {},
    trigger: 'other'
  };

  const suggestion: Omit<SuggestionOptions, 'editor'> = {
    char: '/',
    items: getSuggestionItems,
    render: () => {
      return {
        onStart(props) {
          if (wrapperElRef.trigger === 'keyboard') {
            wrapperElRef.update(props);
            wrapperElRef.setOpen(true);

            wrapperElRef.trigger = 'other';
          }
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

    useEffect(() => {
      const onKeydown = (e: KeyboardEvent) => {
        if (e.key === '/') {
          wrapperElRef.trigger = 'keyboard';
        } else {
          wrapperElRef.trigger = 'other';
        }
      };

      window.addEventListener('keydown', onKeydown);

      return () => {
        window.removeEventListener('keydown', onKeydown);
      };
    }, []);

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
  const rootEl = useRootElRef();

  const triggerElRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { open, onOpenChange } = props;
  const { items = [], command, clientRect } = props.suggestions! || {};

  const rect = clientRect?.();

  useEffect(() => {
    if (rect && rootEl.current && triggerElRef.current) {
      const rootElRect = rootEl.current.getBoundingClientRect();

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
          display: open ? 'block' : 'none',
          position: 'absolute'
        }}
      ></div>
    </Dropdown>
  );
}
