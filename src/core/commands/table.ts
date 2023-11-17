import { TextSelection } from 'prosemirror-state';
import * as Table from 'prosemirror-tables';
import { createTable } from '../helpers';
import { RawCommands } from '../types';

declare global {
  interface Commands<ReturnType> {
    table: {
      insertTable: (options?: {
        rows?: number;
        cols?: number;
        withHeaderRow?: boolean;
      }) => ReturnType;
      addColumnBefore: () => ReturnType;
      addColumnAfter: () => ReturnType;
      deleteColumn: () => ReturnType;
      addRowBefore: () => ReturnType;
      addRowAfter: () => ReturnType;
      deleteRow: () => ReturnType;
      deleteTable: () => ReturnType;
      mergeCells: () => ReturnType;
      splitCell: () => ReturnType;
      toggleHeaderColumn: () => ReturnType;
      toggleHeaderRow: () => ReturnType;
      toggleHeaderCell: () => ReturnType;
      mergeOrSplit: () => ReturnType;
      setCellAttribute: (name: string, value: any) => ReturnType;
      goToNextCell: () => ReturnType;
      goToPreviousCell: () => ReturnType;
      fixTables: () => ReturnType;
      setCellSelection: (position: { anchorCell: number; headCell?: number }) => ReturnType;
    };
  }
}

export const insertTable: RawCommands['insertTable'] =
  ({ rows = 3, cols = 3, withHeaderRow = true } = {}) =>
  ({ tr, dispatch, view }) => {
    const node = createTable(view.state.schema, rows, cols, withHeaderRow);

    if (dispatch) {
      const offset = tr.selection.anchor + 1;

      tr.replaceSelectionWith(node)
        .scrollIntoView()
        .setSelection(TextSelection.near(tr.doc.resolve(offset)));
    }

    return true;
  };

export const addColumnBefore: RawCommands['addColumnBefore'] =
  () =>
  ({ state, dispatch }) => {
    return Table.addColumnBefore(state, dispatch);
  };
export const addColumnAfter: RawCommands['addColumnAfter'] =
  () =>
  ({ state, dispatch }) => {
    return Table.addColumnAfter(state, dispatch);
  };
export const deleteColumn: RawCommands['deleteColumn'] =
  () =>
  ({ state, dispatch }) => {
    return Table.deleteColumn(state, dispatch);
  };
export const addRowBefore: RawCommands['addRowBefore'] =
  () =>
  ({ state, dispatch }) => {
    return Table.addRowBefore(state, dispatch);
  };
export const addRowAfter: RawCommands['addRowAfter'] =
  () =>
  ({ state, dispatch }) => {
    return Table.addRowAfter(state, dispatch);
  };
export const deleteRow: RawCommands['deleteRow'] =
  () =>
  ({ state, dispatch }) => {
    return Table.deleteRow(state, dispatch);
  };
export const deleteTable: RawCommands['deleteTable'] =
  () =>
  ({ state, dispatch }) => {
    return Table.deleteTable(state, dispatch);
  };
export const mergeCells: RawCommands['mergeCells'] =
  () =>
  ({ state, dispatch }) => {
    return Table.mergeCells(state, dispatch);
  };
export const splitCell: RawCommands['splitCell'] =
  () =>
  ({ state, dispatch }) => {
    return Table.splitCell(state, dispatch);
  };
export const toggleHeaderColumn: RawCommands['toggleHeaderColumn'] =
  () =>
  ({ state, dispatch }) => {
    return Table.toggleHeader('column')(state, dispatch);
  };
export const toggleHeaderRow: RawCommands['toggleHeaderRow'] =
  () =>
  ({ state, dispatch }) => {
    return Table.toggleHeader('row')(state, dispatch);
  };
export const toggleHeaderCell: RawCommands['toggleHeaderCell'] =
  () =>
  ({ state, dispatch }) => {
    return Table.toggleHeaderCell(state, dispatch);
  };
export const mergeOrSplit: RawCommands['mergeOrSplit'] =
  () =>
  ({ state, dispatch }) => {
    if (Table.mergeCells(state, dispatch)) {
      return true;
    }

    return Table.splitCell(state, dispatch);
  };
export const setCellAttribute: RawCommands['setCellAttribute'] =
  (name, value) =>
  ({ state, dispatch }) => {
    return Table.setCellAttr(name, value)(state, dispatch);
  };
export const goToNextCell: RawCommands['goToNextCell'] =
  () =>
  ({ state, dispatch }) => {
    return Table.goToNextCell(1)(state, dispatch);
  };
export const goToPreviousCell: RawCommands['goToPreviousCell'] =
  () =>
  ({ state, dispatch }) => {
    return Table.goToNextCell(-1)(state, dispatch);
  };
export const fixTables: RawCommands['fixTables'] =
  () =>
  ({ state, dispatch }) => {
    if (dispatch) {
      Table.fixTables(state);
    }

    return true;
  };

export const setCellSelection: RawCommands['setCellSelection'] =
  position =>
  ({ tr, dispatch }) => {
    if (dispatch) {
      const selection = Table.CellSelection.create(tr.doc, position.anchorCell, position.headCell);

      // @ts-ignore
      tr.setSelection(selection);
    }

    return true;
  };
