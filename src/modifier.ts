import { Editor } from '@tiptap/react';

export const EditorModifier = {
  insertImage(
    editor: Editor,
    image: { url: string; title: string; alt: string },
    event?: ClipboardEvent | DragEvent | Event
  ) {
    const view = editor.view;
    const { url, alt, title } = image;

    // for paste events
    if (event instanceof ClipboardEvent) {
      return view.dispatch(
        view.state.tr.replaceSelectionWith(
          view.state.schema.nodes.image.create({
            src: url,
            alt,
            title
          })
        )
      );

      // for drag and drop events
    } else if (event instanceof DragEvent) {
      const { schema } = view.state;
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY
      });
      const node = schema.nodes.image.create({
        src: url,
        alt,
        title
      }); // creates the image element
      const transaction = view.state.tr.insert(coordinates?.pos || 0, node); // places it in the correct position
      return view.dispatch(transaction);
    }

    // for input upload events
    return view.dispatch(
      view.state.tr.replaceSelectionWith(
        view.state.schema.nodes.image.create({
          src: url,
          alt,
          title
        })
      )
    );
  }
};
