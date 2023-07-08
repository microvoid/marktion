import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DOMParser, Slice } from '@tiptap/pm/model';

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
          clipboardTextParser: (text, context, plainText) => {
            if (plainText || !this.options.transformPastedText) {
              // pasting with shift key prevents formatting
              return Slice.empty;
            }

            const parsed = this.editor.storage.markdown.parser.parse(text, { inline: true });

            return DOMParser.fromSchema(this.editor.schema).parseSlice(elementFromString(parsed), {
              preserveWhitespace: true
            });
          },
          /**
           * @param {import('prosemirror-model').Slice} slice
           */
          clipboardTextSerializer: slice => {
            if (!this.options.transformCopiedText) {
              return null;
            }
            return this.editor.storage.markdown.serializer.serialize(slice.content);
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
