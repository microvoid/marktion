import { HtmlSerializer } from './ssr-serialize';
import { schema } from '..';

export type HtmlSerializeOptions = {
  codeHighlight: boolean;
};

const defaultOptions: HtmlSerializeOptions = {
  codeHighlight: true
};

export function html(markdown: string, options: HtmlSerializeOptions = defaultOptions) {
  return new HtmlSerializer(schema).serialize(markdown);
}
