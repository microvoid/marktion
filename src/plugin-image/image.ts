import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import TiptapImage from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';

export const ImageExtension = TiptapImage.extend({
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

const uploadKey = new PluginKey('upload-image');

export const UploadImagesPlugin = () =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        console.log('tr', tr.getMeta(uploadKey));

        set = set.map(tr.mapping, tr.doc);
        // // See if the transaction adds or removes any placeholders
        // const action = tr.getMeta(this);
        // if (action && action.add) {
        //   const { id, pos, src } = action.add;

        //   const placeholder = document.createElement("div");
        //   placeholder.setAttribute("class", "img-placeholder");
        //   const image = document.createElement("img");
        //   image.setAttribute(
        //     "class",
        //     "opacity-40 rounded-lg border border-stone-200",
        //   );
        //   image.src = src;
        //   placeholder.appendChild(image);
        //   const deco = Decoration.widget(pos + 1, placeholder, {
        //     id,
        //   });
        //   set = set.add(tr.doc, [deco]);
        // } else if (action && action.remove) {
        //   set = set.remove(
        //     set.find(null, null, (spec) => spec.id == action.remove.id),
        //   );
        // }
        return set;
      }
    },
    props: {
      decorations(state) {
        return this.getState(state);
      }
    }
  });
