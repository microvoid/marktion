import cls from 'classnames';
import { html } from '../../core/encoding';

export type ReactSSRProps = React.HTMLAttributes<HTMLDivElement> & {
  content: string;
  innerStyle?: React.CSSProperties;
};

export function ReactSSR({ innerStyle, content, ...wrapperProps }: ReactSSRProps) {
  return (
    <div
      {...wrapperProps}
      data-accent-color="violet"
      className={cls('marktion-themes', wrapperProps.className)}
    >
      <div className="wysiwyg-editor">
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{ __html: html(content, { codeHighlight: true }) }}
          style={innerStyle}
        />
      </div>
    </div>
  );
}
