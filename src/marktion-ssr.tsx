import { parse } from './plugin-markdown/encoding';

export function MarktionSSR({ markdown }: { markdown: string }) {
  return (
    <div className="marktion">
      <div className="marktion-editor">
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: parse(markdown, { codeHighlight: true }) }}
        />
      </div>
    </div>
  );
}
