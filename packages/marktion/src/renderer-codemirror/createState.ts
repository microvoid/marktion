import { minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { Compartment } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { indentWithTab } from '@codemirror/commands';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';

import type { CodemirrorRenderer } from '../renderer-codemirror';

const DEFAULT_KEYMAP = [...defaultKeymap, indentWithTab];
const languageConf = new Compartment();

const internalExtensions = [
  keymap.of(DEFAULT_KEYMAP),
  languageConf.of([markdown()]),
  minimalSetup,
  EditorView.lineWrapping
];

export function createState(codemirror: CodemirrorRenderer) {
  const props = codemirror.getProps();
  const theme = props.theme === 'light' ? syntaxHighlighting(defaultHighlightStyle) : oneDark;

  return EditorState.create({
    doc: props.content,
    extensions: [
      ...internalExtensions,
      theme,
      placeholder('please enter the markdown source'),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          props.onChange?.();
        }
      })
    ]
  });
}
