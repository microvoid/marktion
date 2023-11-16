import { toggleMark as pmToggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { Command } from 'prosemirror-state';
import { schema } from '../schemas';

export const toggleMark =
  (mark: MarkType): Command =>
  (state, dispatch, view) => {
    return pmToggleMark(mark)(state, dispatch, view);
  };

export const toggleStrong = () => toggleMark(schema.marks.strong);
export const toggleEm = () => toggleMark(schema.marks.em);
export const toggleCode = () => toggleMark(schema.marks.code);
export const toggleStrike = () => toggleMark(schema.marks.strike);
