import { MarkType } from 'prosemirror-model';

import { getMarkType } from '../helpers';
import { isMarkActive } from '../helpers';
import { RawCommands } from '../types.js';
import { MarkdownMark } from '..';

declare global {
  interface Commands<ReturnType> {
    toggleMark: {
      /**
       * Toggle a mark on and off.
       */
      toggleMark: (
        typeOrName: MarkdownMark | MarkType,
        attributes?: Record<string, any>,
        options?: {
          /**
           * Removes the mark even across the current selection. Defaults to `false`.
           */
          extendEmptyMarkRange?: boolean;
        }
      ) => ReturnType;
    };
    toggleStrong: {
      toggleStrong: () => ReturnType;
    };
    toggleEm: {
      toggleEm: () => ReturnType;
    };
    toggleCode: {
      toggleCode: () => ReturnType;
    };
    toggleStrike: {
      toggleStrike: () => ReturnType;
    };
  }
}

export const toggleMark: RawCommands['toggleMark'] =
  (typeOrName, attributes = {}, options = {}) =>
  ({ state, commands }) => {
    const { extendEmptyMarkRange = false } = options;
    const type = getMarkType(typeOrName, state.schema);
    const isActive = isMarkActive(state, type, attributes);

    if (isActive) {
      return commands.unsetMark(type, { extendEmptyMarkRange });
    }

    return commands.setMark(type, attributes);
  };

export const toggleStrong: RawCommands['toggleStrong'] =
  () =>
  ({ commands }) => {
    return commands.toggleMark('strong');
  };

export const toggleEm: RawCommands['toggleEm'] =
  () =>
  ({ commands }) => {
    return commands.toggleMark('em');
  };

export const toggleCode: RawCommands['toggleCode'] =
  () =>
  ({ commands }) => {
    return commands.toggleMark('code');
  };

export const toggleStrike: RawCommands['toggleStrike'] =
  () =>
  ({ commands }) => {
    return commands.toggleMark('strike');
  };
