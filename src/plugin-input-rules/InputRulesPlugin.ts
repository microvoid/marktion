import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis,
  InputRule
} from 'prosemirror-inputrules';
import { NodeType } from 'prosemirror-model';
import { createTable } from './table';
import { MarkdownSchema } from '../core';
import { TextSelection } from 'prosemirror-state';

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
export function orderedListRule(nodeType: NodeType) {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    match => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1]
  );
}

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export function bulletListRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

/// A input rule for creating code block.
/// For example, ` ```javascript ` will create a code block with language javascript.
export function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```(?<language>[a-z]*)?[\s\n]$/, nodeType, match => ({
    language: match.groups?.language ?? ''
  }));
}

/// Given a node type and a maximum level, creates an input rule that
/// turns up to that number of `#` characters followed by a space at
/// the start of a textblock into a heading whose level corresponds to
/// the number of `#` signs.
export function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'), nodeType, match => ({
    level: match[1].length
  }));
}

/// A input rule for creating table.
/// For example, `|2x2|` will create a 2x2 table.
export function insertTableInputRule(schema: MarkdownSchema) {
  return new InputRule(/^\|(?<col>\d+)[xX](?<row>\d+)\|\s$/, (state, match, start, end) => {
    const $start = state.doc.resolve(start);
    if (
      !$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), schema.nodes.table)
    )
      return null;

    const tableNode = createTable(schema, Number(match.groups?.row), Number(match.groups?.col));
    const tr = state.tr.replaceRangeWith(start, end, tableNode);
    return tr.setSelection(TextSelection.create(tr.doc, start + 3)).scrollIntoView();
  });
}

/// A set of input rules for creating the basic block quotes, lists,
/// code blocks, and heading.
export function InputRulesPlugin(schema: MarkdownSchema) {
  const rules = smartQuotes.concat(
    ellipsis,
    emDash,
    blockQuoteRule(schema.nodes.blockquote),
    orderedListRule(schema.nodes.ordered_list),
    bulletListRule(schema.nodes.bullet_list),
    codeBlockRule(schema.nodes.code_block),
    headingRule(schema.nodes.heading, 6),
    insertTableInputRule(schema)
  );

  return inputRules({ rules });
}
