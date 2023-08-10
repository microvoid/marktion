import { parse } from './plugin-markdown/encoding';

export function MarktionSSR({
  markdown,
  className,
  innerStyle
}: {
  markdown: string;
  className?: string;
  innerStyle?: React.CSSProperties;
}) {
  return (
    <div className={`marktion ${className}`}>
      <div className="marktion-editor">
        <div
          style={{ ...innerStyle }}
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: parse(markdown, { codeHighlight: true }) }}
        />
      </div>
    </div>
  );
}
