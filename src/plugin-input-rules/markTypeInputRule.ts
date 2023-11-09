import { InputRule } from 'prosemirror-inputrules';
import { Attrs, MarkType } from 'prosemirror-model';

export function markTypeInputRule(
  regexp: RegExp,
  markType: MarkType,
  updateCaptured: UpdateCaptured = a => a,
  getAttributes?: (captured: UpdateCaptureTextProps, match: RegExpMatchArray) => Attrs
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const { tr } = state;

    const captured = updateCaptured({
      fullMatch: match[0],
      captureGroup: match[1],
      start,
      end
    });

    const attrs = getAttributes?.(captured, match);

    let { fullMatch, captureGroup, start: markStart, end: markEnd } = captured;

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

      return tr.addMark(markStart, markEnd, markType.create(attrs));
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
