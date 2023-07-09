import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Select } from 'antd';
import { useMemo } from 'react';

export function LanguageSelector({
  node: {
    attrs: { language: defaultLanguage }
  },
  updateAttributes,
  extension
}: any) {
  const languages = extension.options.lowlight.listLanguages() as string[];

  const options = useMemo(() => {
    return [
      { value: '', label: '-' },
      ...languages.map(language => {
        return { value: language, label: language };
      })
    ];
  }, [languages]);

  return (
    <NodeViewWrapper className="code-block">
      <Select
        defaultValue={defaultLanguage}
        className="code-block-lang-select"
        style={{ width: 120 }}
        bordered={false}
        options={options}
        onChange={language => updateAttributes({ language })}
      />

      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
