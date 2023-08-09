import { parse } from './plugin-markdown/encoding';

export function MarktionSSR({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div className={`marktion ${className}`}>
      <div className="marktion-editor">
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: parse(markdown, { codeHighlight: true }) }}
        />
      </div>
    </div>
  );
}
