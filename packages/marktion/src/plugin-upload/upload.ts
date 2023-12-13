import { EditorView } from 'prosemirror-view';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Fragment, Node } from 'prosemirror-model';
import { defaultUploader } from './defaultUploader';

export type UploadPluginState = DecorationSet;
export const UploadPluginPluginKey = new PluginKey<UploadPluginState>('plugin-upload');

export type UploadOptions = {
  enableHtmlFileUploader?: boolean;
  uploader?: (
    files: FileList,
    event: ClipboardEvent | DragEvent | Event,
    view: EditorView
  ) => Promise<Fragment | Node | Node[]>;
};

const defaultOptions = {
  uploader: defaultUploader
};

export const upload = (options: UploadOptions = defaultOptions) => {
  return new Plugin({
    key: UploadPluginPluginKey,

    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        const _set = set.map(tr.mapping, tr.doc);
        const action = getUploadAction(tr);

        if (!action) return _set;

        if (action.type === 'insert') {
          const widget = createPlaceholder();
          const decoration = Decoration.widget(action.pos, widget, { id: action.id });

          return _set.add(tr.doc, [decoration]);
        }

        if (action.type === 'remove') {
          const target = _set.find(undefined, undefined, spec => spec.id === action.id);
          return _set.remove(target);
        }

        return _set;
      }
    },
    props: {
      decorations(state) {
        return UploadPluginPluginKey.getState(state);
      },
      handlePaste(view, event) {
        if (!(event instanceof ClipboardEvent)) return false;

        if (!options.enableHtmlFileUploader && event.clipboardData?.getData('text/html'))
          return false;

        return handleUpload(view, event.clipboardData?.files, event, options);
      },
      handleDrop: (view, event) => {
        if (!(event instanceof DragEvent)) return false;

        return handleUpload(view, event.dataTransfer?.files, event, options);
      }
    }
  });
};

function createPlaceholder() {
  const el = document.createElement('div');

  el.setAttribute('data-role', 'plugin-upload-placeholder');

  return el;
}

function findPlaceholder(state: EditorState, id: string) {
  const decos = UploadPluginPluginKey.getState(state);

  if (decos) {
    const found = decos.find(undefined, undefined, spec => spec.id == id);
    return found.length ? found[0].from : -1;
  }

  return -1;
}

type UploadAction = { id: string; pos: number; type: 'insert' } | { type: 'remove'; id: string };

function setUploadAction(tr: Transaction, action: UploadAction) {
  return tr.setMeta(UploadPluginPluginKey, action);
}

function getUploadAction(tr: Transaction): UploadAction | null {
  return tr.getMeta(UploadPluginPluginKey) || null;
}

export function handleUpload(
  view: EditorView,
  files: FileList | undefined,
  event: ClipboardEvent | DragEvent | Event,
  options: UploadOptions = defaultOptions
) {
  if (!files || files.length <= 0) return false;

  const tr = view.state.tr;
  const insertPos =
    event instanceof DragEvent
      ? view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? tr.selection.from
      : tr.selection.from;
  const id = uuid();

  view.dispatch(setUploadAction(tr, { id, pos: insertPos, type: 'insert' }));

  options
    .uploader?.(files, event, view)
    .then(fragment => {
      const pos = findPlaceholder(view.state, id.toString());

      if (pos < 0) return;

      view.dispatch(
        setUploadAction(view.state.tr.replaceWith(pos, pos, fragment), { type: 'remove', id })
      );
    })
    .catch(e => {
      console.error(e);
    });
  return true;
}

let i = 0;

function uuid() {
  return `upload-id-${i++}`;
}
