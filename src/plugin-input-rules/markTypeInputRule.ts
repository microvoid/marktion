import { InputRule } from 'prosemirror-inputrules';
import { MarkType } from 'prosemirror-model';

export function markTypeInputRule(
  regexp: RegExp,
  markType: MarkType,
  updateCaptured: UpdateCaptured = a => a
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const { tr } = state;

    let {
      fullMatch,
      captureGroup,
      start: markStart,
      end: markEnd
    } = updateCaptured({
      fullMatch: match[0],
      captureGroup: match[1],
      start,
      end
    });

    if (captureGroup) {
      const startSpaces = fullMatch.search(/\S/);
      const textStart = markStart + fullMatch.indexOf(captureGroup);
      const textEnd = textStart + captureGroup.length;

      if (textEnd < markEnd) {
        tr.delete(textEnd, markEnd);
      }

      if (textStart > markStart) {
        tr.delete(markStart + startSpaces, textStart);
      }

      markEnd = markStart + startSpaces + captureGroup.length;

      return tr.addMark(markStart, markEnd, markType.create());
    }

    return null;
  });
}

type UpdateCaptured = (captured: UpdateCaptureTextProps) => UpdateCaptureTextProps;

type UpdateCaptureTextProps = {
  /**
   * The first capture group from the matching input rule.
   */
  captureGroup: string | undefined;

  /**
   * The text of the full match which was received.
   */
  fullMatch: string;

  /**
   * The starting position of the match relative to the `doc`.
   */
  start: number;

  /**
   * The end position of the match relative to the `doc`.
   */
  end: number;
};
