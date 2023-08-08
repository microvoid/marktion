import { Range, Editor } from '@tiptap/react';
import {
  BorderTopIcon,
  BorderBottomIcon,
  BorderLeftIcon,
  DividerVerticalIcon,
  DividerHorizontalIcon,
  BorderRightIcon
} from '@radix-ui/react-icons';
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
import { UploadImageHandler } from '../handler';
import { EditorModifier } from '../modifier';
import { SuggestionOptions } from '@tiptap/suggestion';

interface CommandProps {
  editor: Editor;
  range: Range;
}

type GetSuggestionItems = NonNullable<SuggestionOptions['items']>;
type SuggestionItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: React.ReactNode;
  command: ({ editor, range }: CommandProps) => void;
};

export const getSuggestionItems: GetSuggestionItems = ({ query, editor }) => {
  const isTableActive = editor.isActive('table');
  const suggestions = isTableActive ? getTableSuggestions() : getDefaultSuggestions();

  return suggestions.filter(item => {
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
};

const getDefaultSuggestions = (): SuggestionItem[] => {
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
      icon: <TextIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
      }
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list.',
      searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
      icon: <ListChecksIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      }
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      searchTerms: ['title', 'big', 'large'],
      icon: <Heading1 />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      }
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      searchTerms: ['subtitle', 'medium'],
      icon: <Heading2 />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      }
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      searchTerms: ['subtitle', 'small'],
      icon: <Heading3 />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      }
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list.',
      searchTerms: ['unordered', 'point'],
      icon: <ListIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      }
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering.',
      searchTerms: ['ordered'],
      icon: <ListOrderedIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      }
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      searchTerms: ['blockquote'],
      icon: <QuoteIcon />,
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
      icon: <Code2Icon />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
    {
      title: 'Image',
      description: 'Upload an image from your computer.',
      searchTerms: ['photo', 'picture', 'media'],
      icon: <ImageIcon />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();

        // upload image
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async event => {
          const file = input.files?.[0];
          const uploader = UploadImageHandler.get(editor);
          if (file && uploader) {
            const url = await uploader(file, editor);

            EditorModifier.insertImage(
              editor,
              {
                url,
                title: file.name,
                alt: file.name
              },
              event
            );
          }
        };
        input.click();
      }
    },
    {
      title: 'Table',
      description: 'Simple powerfull table.',
      searchTerms: ['table'],
      icon: <TableIcon />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
    }
  ];
};

const getTableSuggestions = (): SuggestionItem[] => {
  return [
    {
      title: 'add row after',
      description: '',
      searchTerms: ['row', 'add', 'after'],
      command: ({ editor }) => {
        editor.chain().focus().addRowAfter().run();
      },
      icon: <BorderBottomIcon className="w-[14px] h-[14px]" />
    },
    {
      title: 'add row before',
      description: '',
      searchTerms: ['row', 'add', 'before'],
      command: ({ editor }) => {
        editor.chain().focus().addRowBefore().run();
      },
      icon: <BorderTopIcon className="w-[14px] h-[14px]" />
    },
    {
      title: 'add col after',
      description: '',
      searchTerms: ['col', 'add', 'after'],
      command: ({ editor }) => {
        editor.chain().focus().addColumnAfter().run();
      },
      icon: <BorderRightIcon className="w-[14px] h-[14px]" />
    },
    {
      title: 'add col before',
      description: '',
      searchTerms: ['col', 'add', 'before'],
      command: ({ editor }) => {
        editor.chain().focus().addColumnBefore().run();
      },
      icon: <BorderLeftIcon className="w-[14px] h-[14px]" />
    },
    {
      title: 'delete row',
      description: '',
      searchTerms: ['row', 'delete'],
      command: ({ editor }) => {
        editor.chain().focus().deleteRow().run();
      },
      icon: <DividerHorizontalIcon className="w-[14px] h-[14px]" />
    },
    {
      title: 'delete col',
      description: '',
      searchTerms: ['col', 'delete'],
      command: ({ editor }) => {
        editor.chain().focus().deleteColumn().run();
      },
      icon: <DividerVerticalIcon className="w-[14px] h-[14px]" />
    }
  ];
};
