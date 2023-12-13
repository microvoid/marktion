import { parse } from '../encoding';
import { Range, RawCommands } from '../types';

declare global {
  interface Commands<ReturnType> {
    markdown: {
      setMarkdwon: (content: string, emitUpdate?: boolean) => ReturnType;
      insertMarkdownAt: (position: number | Range, value: string) => ReturnType;
    };
  }
}

export const insertMarkdownAt: RawCommands['insertMarkdownAt'] =
  (range, content) =>
  ({ tr, dispatch }) => {
    const doc = parse(content);

    if (dispatch) {
      const from = typeof range === 'number' ? range : range.from;
      const to = typeof range === 'number' ? range : range.to;

      tr.replaceWith(from, to, doc);
    }

    return true;
  };
