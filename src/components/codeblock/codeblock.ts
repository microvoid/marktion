import { NodeViewConstructor } from 'prosemirror-view';
import { Compartment } from '@codemirror/state';
import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { minimalSetup } from 'codemirror';
import { CodeMirrorNodeView } from './CodeMirrorNodeView';

export const codeblock: NodeViewConstructor = (node, view, getPos) => {
  const languageConf = new Compartment();

  const nodeView = new CodeMirrorNodeView({
    node,
    view,
    toggleName: 'paragraph',
    extensions: [languageConf.of([]), minimalSetup, oneDark],
    getPos: getPos as () => number,
    loadLanguage
  });

  return nodeView;
};

function loadLanguage(name: string) {
  const lang = languageMap[name.toLowerCase()];

  if (!lang) {
    return;
  }

  if (lang.support) {
    return Promise.resolve(lang.support);
  }

  return lang.load();
}

const languageMap = (() => {
  const languageMap: Record<string, LanguageDescription> = {};

  for (const language of languages ?? []) {
    for (const alias of language.alias) {
      languageMap[alias] = language;
    }
  }

  return languageMap;
})();
