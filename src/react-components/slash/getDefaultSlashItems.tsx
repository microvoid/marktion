import {
  Heading1,
  Heading2,
  Heading3,
  ListIcon,
  ListChecksIcon,
  ListOrderedIcon,
  TextIcon,
  Code2Icon,
  QuoteIcon,
  ImageIcon,
  TableIcon
} from 'lucide-react';
import { ProseMirrorRenderer } from '../../prosemirror';

export type SlashItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: React.ReactNode;
  command: (editor: ProseMirrorRenderer, range: { from: number; to: number }) => void;
};

export const getDefaultSlashItems = (): SlashItem[] => {
  return [
    // {
    //   title: 'Continue writing',
    //   description: 'Use AI to expand your thoughts.',
    //   searchTerms: ['gpt']
    //   // icon: <Magic className="w-7 text-black" />,
    // },
    {
      title: 'Todo List',
      description: 'Track tasks with a todo list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: <ListChecksIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      }
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: <ListIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      }
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrderedIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      }
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: <QuoteIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run();
      }
    },
    {
      title: 'Code',
      description: 'Capture a code snippet.',
      searchTerms: ['codeblock'],
      icon: <Code2Icon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      }
    },
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      searchTerms: ['photo', 'picture', 'media'],
      icon: <ImageIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        // editor.chain().focus().deleteRange(range).run();

        // upload image
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async event => {};
        input.click();
      }
    },
    {
      title: 'Table',
      description: 'Simple powerfull table.',
      searchTerms: ['table'],
      icon: <TableIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      }
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: <Heading1 style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      }
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: <Heading2 style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      }
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: <Heading3 style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      }
    },
    {
      title: 'Text',
      description: 'Just start typing with plain text.',
      searchTerms: ['p', 'paragraph'],
      icon: <TextIcon style={{ width: 16, height: 16 }} />,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
      }
    }
  ];
};
