import { EditorState } from 'prosemirror-state';
import { MarkdownMark, schema } from '../schemas';
import { isMarkActive } from './isMarkActive';

export function isActive(state: EditorState, mark: MarkdownMark) {
  const type = schema.marks[mark];
  return isMarkActive(state, type);
}
