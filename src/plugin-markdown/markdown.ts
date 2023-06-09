import { Extension } from '@tiptap/core';
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
      transformPastedText: false,
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
        return ({ commands, editor }) => {
          const storage = editor.storage.markdown as MarkdownStorage;
          const parsed = storage.parse(content);

          return commands.insertContentAt(range, parsed, options);
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
