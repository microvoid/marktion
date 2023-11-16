import { MarkType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { MarkdownMark, schema } from '../schemas';

export function isActive(state: EditorState, mark: MarkdownMark) {
  const type = schema.marks[mark];
  return isMarkActive(state, type);
}

export function isMarkActive(state: EditorState, type: MarkType) {
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }

  return state.doc.rangeHasMark(from, to, type);
}
