import { Node as ProsemirrorNode } from 'prosemirror-model';
import { CodeMirrorNodeView } from '../node-view/CodeMirrorNodeView';

export type Toolbar = {
  update(node: ProsemirrorNode): void;
  destory(): void;
};

export function createToolbar(node: CodeMirrorNodeView): Toolbar {
  const languages = node.getLanguages();
  const document = node.dom.ownerDocument;

  const toolbar = document.createElement('div');
  const langEl = document.createElement('select');

  toolbar.classList.add('components-codeblock-setting');
  toolbar.appendChild(langEl);

  node.dom.appendChild(toolbar);

  const langs = languages
    .map(lang => {
      const alias = lang.alias[0] || lang.name.toLowerCase();

      return {
        label: alias,
        value: alias
      };
    })
    .sort((a, b) => (a.value > b.value ? 1 : -1));

  langs.forEach(lang => {
    const optionEl = document.createElement('option');
    optionEl.text = lang.label;
    optionEl.value = lang.value;

    langEl.appendChild(optionEl);
  });

  const onLangElChange = () => node.setLanguage(langEl.value);

  langEl.value = node.getLanguage();
  langEl.addEventListener('change', onLangElChange);

  return {
    update(node) {
      langEl.value = node.attrs.language;
    },
    destory() {
      langEl.removeEventListener('change', onLangElChange);
    }
  };
}
