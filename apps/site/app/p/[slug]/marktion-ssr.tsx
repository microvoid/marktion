import { parse } from 'marktion/dist/plugin-markdown/encoding';

export function MarktionSSR({ markdown }: { markdown: string }) {
  return (
    <div className="marktion">
      <div className="marktion-editor">
        <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: parse(markdown) }}></div>
      </div>
    </div>
  );
}
