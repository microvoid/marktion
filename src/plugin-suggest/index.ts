/**
 * Primitives for building your prosemirror suggestion and autocomplete
 * functionality.
 *
 * Forked from https://github.com/remirror/remirror/blob/main/packages/prosemirror-suggest
 *
 * @module
 */

export {
  addSuggester,
  getSuggestPluginState,
  ignoreUpdateForSuggest,
  removeSuggester,
  suggest
} from './plugin';

export {
  isChangeReason,
  isExitReason,
  isInvalidSplitReason,
  isJumpReason,
  isRemovedReason,
  isSelectionChangeReason,
  isSelectionExitReason,
  isSplitReason,
  isValidMatch,
  selectionOutsideMatch
} from './predicates';
export type { SuggestState } from './state';
export * from './types';
export {
  createRegexFromSuggester,
  DEFAULT_SUGGESTER,
  findFromSuggesters,
  getSuggesterWithDefaults,
  IGNORE_SUGGEST_META_KEY,
  markActiveInRange,
  positionHasMarks,
  rangeHasMarks
} from './utils';
