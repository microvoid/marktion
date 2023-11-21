import {
  BorderTopIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  DividerVerticalIcon,
  DividerHorizontalIcon,
  BorderRightIcon
} from '@radix-ui/react-icons';
import type { SlashItem } from './getDefaultSlashItems';

export const getTableSlashItems = (): SlashItem[] => {
  return [
    {
      title: 'add row after',
      description: '',
      searchTerms: ['row', 'add', 'after'],
      command: editor => {
        editor.chain().focus().addRowAfter().run();
      },
      icon: <BorderBottomIcon style={{ width: 14, height: 14 }} />
    },
    {
      title: 'add row before',
      description: '',
      searchTerms: ['row', 'add', 'before'],
      command: editor => {
        editor.chain().focus().addRowBefore().run();
      },
      icon: <BorderTopIcon style={{ width: 14, height: 14 }} />
    },
    {
      title: 'add col after',
      description: '',
      searchTerms: ['col', 'add', 'after'],
      command: editor => {
        editor.chain().focus().addColumnAfter().run();
      },
      icon: <BorderRightIcon style={{ width: 14, height: 14 }} />
    },
    {
      title: 'add col before',
      description: '',
      searchTerms: ['col', 'add', 'before'],
      command: editor => {
        editor.chain().focus().addColumnBefore().run();
      },
      icon: <BorderLeftIcon style={{ width: 14, height: 14 }} />
    },
    {
      title: 'delete row',
      description: '',
      searchTerms: ['row', 'delete'],
      command: editor => {
        editor.chain().focus().deleteRow().run();
      },
      icon: <DividerHorizontalIcon style={{ width: 14, height: 14, color: 'red' }} />
    },
    {
      title: 'delete col',
      description: '',
      searchTerms: ['col', 'delete'],
      command: editor => {
        editor.chain().focus().deleteColumn().run();
      },
      icon: <DividerVerticalIcon style={{ width: 14, height: 14, color: 'red' }} />
    }
  ];
};
