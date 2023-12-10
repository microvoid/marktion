import { Node as ProsemirrorNode } from 'prosemirror-model';
import { LanguageDescription } from '@codemirror/language';

export type SettingViewContext = {
  wrapperEl: HTMLElement;

  update: (node: ProsemirrorNode) => void;
  destory: () => void;
};

export const Settings = [
  {
    name: 'lang-select'
  }
];

type CreateSettingViewOptions = {
  langs: LanguageDescription[];
  onLangChange: (lang: string) => void;
};
export function createSettingView(options: CreateSettingViewOptions): SettingViewContext {
  const langSelectorWrapperEl = document.createElement('div');
  const langSelectorEl = document.createElement('select');

  langSelectorWrapperEl.classList.add('components-codeblock-setting');
  langSelectorWrapperEl.appendChild(langSelectorEl);

  options.langs.forEach(lang => {
    const optionEl = document.createElement('option');
    optionEl.value = lang.name.toLowerCase();
    optionEl.text = lang.name;

    langSelectorEl.appendChild(optionEl);
  });

  langSelectorEl.addEventListener('change', handleLangChange);

  function handleLangChange() {
    options.onLangChange(langSelectorEl.value);
  }

  return {
    wrapperEl: langSelectorWrapperEl,
    update(node) {
      langSelectorEl.value = node.attrs.language;
    },
    destory() {
      langSelectorEl.removeEventListener('change', handleLangChange);
    }
  };
}

export function renderSetting() {}
