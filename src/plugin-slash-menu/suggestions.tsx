import { Range, Editor } from '@tiptap/react';
import { CodeIcon, ListBulletIcon, QuoteIcon, TextIcon, ImageIcon } from '@radix-ui/react-icons';
import { Heading1, Heading2, Heading3, ListChecksIcon, ListOrderedIcon } from 'lucide-react';
import { UploadImageHandler } from '../handler';
import { EditorModifier } from '../modifier';
import { SuggestionOptions } from '@tiptap/suggestion';

interface CommandProps {
  editor: Editor;
  range: Range;
}

export const getSuggestionItems: SuggestionOptions['items'] = ({ query, editor }) => {
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
      icon: <ImageIcon className="w-[14px] h-[14px]" />,
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
};
