import { Extension, getHTMLFromFragment } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DOMParser, Slice } from '@tiptap/pm/model';
import { MarkdownStorage } from './interface';

export const MarkdownClipboardExtension = Extension.create({
  name: 'markdownClipboard',
  addOptions() {
    return {
      transformPastedText: false,
      transformCopiedText: false
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownClipboard'),
        props: {
          clipboardTextParser: (text, _, plainText) => {
            if (plainText || !this.options.transformPastedText) {
              // pasting with shift key prevents formatting
              return Slice.empty;
            }

            const storage = this.editor.storage.markdown as MarkdownStorage;
            const parsed = storage.parse(text);

            return DOMParser.fromSchema(this.editor.schema).parseSlice(elementFromString(parsed), {
              preserveWhitespace: true
            });
          },
          clipboardTextSerializer: slice => {
            if (!this.options.transformCopiedText) {
              return '';
            }

            const storage = this.editor.storage.markdown as MarkdownStorage;
            const html = getHTMLFromFragment(slice.content, this.editor.schema);

            return storage.serialize(html) || '';
          }
        }
      })
    ];
  }
});

function elementFromString(value: string) {
  // add a wrapper to preserve leading and trailing whitespace
  const wrappedValue = `<body>${value}</body>`;

  return new window.DOMParser().parseFromString(wrappedValue, 'text/html').body;
}
