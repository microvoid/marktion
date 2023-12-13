import {
  Compartment,
  EditorState as CodeMirrorEditorState,
  Extension as CodeMirrorExtension,
  Transaction as CodeMirrorTransaction
} from '@codemirror/state';
import {
  Command as CodeMirrorCommand,
  EditorView as CodeMirrorEditorView,
  KeyBinding as CodeMirrorKeyBinding,
  keymap
} from '@codemirror/view';

export type ViewCodemirrorContext = {
  cm: CodeMirrorEditorView;

  updating: boolean;
};

// init
export function initViewCodemirror() {}
