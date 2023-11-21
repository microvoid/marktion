import { Node } from 'prosemirror-model';
import type { UploadOptions } from './upload';

/// Read the image file as base64.
export function readImageAsBase64(file: File): Promise<{ alt: string; src: string }> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        resolve({
          alt: file.name,
          src: reader.result as string
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });
}

/// The default uploader.
/// It will upload transform images to base64.
export const defaultUploader: UploadOptions['uploader'] = async (files, event, view) => {
  const imgs: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) continue;

    if (!file.type.includes('image')) continue;

    imgs.push(file);
  }

  const data = await Promise.all(imgs.map(img => readImageAsBase64(img)));

  return data.map(
    ({ alt, src }) => view.state.schema.nodes.image.createAndFill({ src, alt }) as Node
  );
};
