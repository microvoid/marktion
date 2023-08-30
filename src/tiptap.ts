import TiptapImage from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

import TiptapTaskItem from '@tiptap/extension-task-item';
import TiptapTaskList from '@tiptap/extension-task-list';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Placeholder from '@tiptap/extension-placeholder';

import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Code } from '@tiptap/extension-code';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
import { History } from '@tiptap/extension-history';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Italic } from '@tiptap/extension-italic';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';

import { FenseExtension } from './plugin-fense';
import { MarkdownExtension } from './plugin-markdown';

const TaskList = TiptapTaskList.extend({
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51
      },
      {
        tag: 'ul.contains-task-list',
        priority: 51
      }
    ];
  }
});

const TaskItem = TiptapTaskItem.extend({
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: element =>
          element.querySelector('input[type="checkbox"]')?.hasAttribute('checked'),
        renderHTML: attributes => ({
          'data-checked': attributes.checked
        })
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51
      },
      {
        tag: `li.task-list-item`,
        priority: 51
      }
    ];
  }
});

const Image = TiptapImage.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'p',
      {
        role: 'image-wrapper'
      },
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    ];
  }
}).configure({
  allowBase64: true
});

export const defaultTiptapExtensions = [
  MarkdownExtension,
  Highlight,
  Typography,
  TaskList.configure({
    HTMLAttributes: {
      class: 'not-prose contains-task-list'
    }
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: 'task-list-item'
    },
    nested: true
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands, 'Space' for AI ...";
    },
    includeChildren: true
  }),
  Image,
  Link,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FenseExtension,

  Blockquote,
  Bold,
  BulletList,
  Code,
  Document,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Italic,
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  Text
];
