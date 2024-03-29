import { CodeMirrorNodeView } from '../node-view/CodeMirrorNodeView';

export type Toolbar = {
  update(nodeView: CodeMirrorNodeView): void;
  destory(): void;
};

export function createToolbar(nodeView: CodeMirrorNodeView): Toolbar {
  const languages = nodeView.getLanguages();
  const document = nodeView.dom.ownerDocument;

  const toolbar = document.createElement('div');
  const langEl = document.createElement('select');

  toolbar.classList.add('components-codeblock-setting');
  toolbar.appendChild(langEl);

  nodeView.dom.appendChild(toolbar);

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

  const onLangElChange = () => nodeView.setLanguage(langEl.value);

  langEl.value = nodeView.getLanguage();
  langEl.addEventListener('change', onLangElChange);

  return {
    update() {
      langEl.value = nodeView.getLanguage();
    },
    destory() {
      langEl.removeEventListener('change', onLangElChange);
    }
  };
}
