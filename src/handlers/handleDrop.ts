import { EditorProps } from '@tiptap/pm/view';

export const handleDrop: EditorProps['handleDrop'] = (view, event, _slice, moved) => {
  if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY
    });

    // here we deduct 1 from the pos or else the image will create an extra node

    // startImageUpload(file, view, coordinates.pos - 1);

    return true;
  }
  return false;
};
