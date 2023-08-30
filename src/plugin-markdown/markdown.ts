import { Extension, createDocument } from '@tiptap/core';
import { MarkdownClipboardExtension } from './clipboard';
import { MarkdownOptions, MarkdownStorage } from './interface';
import { parse, serialize } from './encoding';

export const MarkdownExtension = Extension.create<MarkdownOptions, MarkdownStorage>({
  name: 'markdown',
  priority: 50,
  addOptions() {
    return {
      html: true,
      bulletListMarker: '-',
      linkify: false,
      breaks: false,
      transformPastedText: true,
      transformCopiedText: false
    };
  },
  addCommands() {
    return {
      setMarkdwon(content, emitUpdate, parseOptions) {
        return ({ commands, editor }) => {
          const storage = editor.storage.markdown as MarkdownStorage;
          const parsed = storage.parse(content);

          return commands.setContent(parsed, emitUpdate, parseOptions);
        };
      },

      insertMarkdownAt(range, content, options) {
        return ({ editor, tr, dispatch }) => {
          const storage = editor.storage.markdown as MarkdownStorage;
          const parsed = storage.parse(content);
          const document = createDocument(parsed, editor.schema, options?.parseOptions);

          if (dispatch) {
            const from = typeof range === 'number' ? range : range.from;
            const to = typeof range === 'number' ? range : range.to;

            tr.replaceWith(from, to, document);
          }

          return true;
        };
      }
    };
  },
  addStorage() {
    return {
      parse,
      serialize
    };
  },
  addExtensions() {
    return [
      MarkdownClipboardExtension.configure({
        transformPastedText: this.options.transformPastedText,
        transformCopiedText: this.options.transformCopiedText
      })
    ];
  }
});
