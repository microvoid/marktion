import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  InputRule
} from 'prosemirror-inputrules';
import { NodeType, MarkType } from 'prosemirror-model';
import isArray from 'lodash/isArray';
import { createTable } from './table';
import { MarkdownSchema } from '../core';
import { TextSelection } from 'prosemirror-state';
import { markTypeInputRule } from './markTypeInputRule';

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

/// A input rule for creating task.
/// For example, `[ ]` or `[x]` will create a task.
export function insertTaskRule(nodeType: NodeType) {
  const reg = /^\s*(\[( ?|x|X)]\s)$/;

  return [
    wrappingInputRule(reg, nodeType, match => {
      const value = isArray(match) ? match[2] : match;

      return {
        checked: ['x', 'X'].includes(value || '')
      };
    })
  ];
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

/// Input rule to insert a hr.
/// For example, `---` will be converted to a hr.
export function insertHrInputRule(nodeType: NodeType) {
  return new InputRule(/^(?:---|___)\s$/, (state, match, start, end) => {
    const { tr } = state;

    if (match[0]) tr.replaceWith(start - 1, end, nodeType.create());

    return tr;
  });
}

/// This input rule will insert a image node.
/// You can input `![alt](src "title")` to insert a image node.
/// The `title` is optional.
export function insertImageRule(nodeType: NodeType) {
  return new InputRule(
    /!\[(?<alt>.*?)]\((?<filename>.*?)\s*(?="|\))"?(?<title>[^"]+)?"?\)\s$/,
    (state, match, start, end) => {
      const [matched, alt, src = '', title] = match;

      if (matched) {
        return state.tr.replaceWith(start, end, nodeType.create({ src, alt, title }));
      }

      return null;
    }
  );
}

/// Input rule to mark strong.
/// For example, `**value**` will be marked as strong.
export function markStrong(markType: MarkType) {
  return markTypeInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, markType);
}

/// Input rule to mark em.
/// For example, `*value*` will be marked as em.
export function markEm(markType: MarkType) {
  return [
    markTypeInputRule(/(?:^|[^*])\*([^*]+)\*$/, markType, function (captured) {
      if (!captured.fullMatch.startsWith('*')) {
        captured.fullMatch = captured.fullMatch.slice(1);
        captured.start = captured.start + 1;
      }
      return captured;
    }),
    markTypeInputRule(/(?:^|\W)_([^_]+)_$/, markType, function (captured) {
      if (!captured.fullMatch.startsWith('_')) {
        captured.fullMatch = captured.fullMatch.slice(1);
        captured.start = captured.start + 1;
      }
      return captured;
    })
  ];
}

export const LEAF_NODE_REPLACING_CHARACTER = '\uFFFC';

/// Input rule to mark code.
/// For example, `\`value\`` will be marked as code.
export function markCode(markType: MarkType) {
  return markTypeInputRule(
    new RegExp(`(?:\`)([^\`${LEAF_NODE_REPLACING_CHARACTER}]+)(?:\`)$`),
    markType
  );
}

/// Input rule to mark strike.
/// For example, `~value~` will be marked as strike.
export function markStrike(markType: MarkType) {
  return markTypeInputRule(/~([^~]+)~$/, markType);
}

/// Input rule to mark link.
/// For example, `[marktion](https://marktion.io)` will be marked as link.
export function insertLinkRule(markType: MarkType) {
  return new InputRule(
    /\[(?<label>.*?)]\((?<href>.*?)\s*(?="|\))"?(?<title>[^"]+)?"?\)\s$/,
    (state, match, start, end) => {
      const { tr } = state;
      const [matched, label, href = '', title] = match;

      if (matched) {
        const value = label || href;
        const markEnd = end + (value.length - matched.length) + 1;

        tr.replaceWith(start, end, markType.schema.text(value));
        tr.addMark(
          start,
          markEnd,
          markType.create({
            href,
            title: label
          })
        );

        return tr;
      }

      return null;
    }
  );
}

/// A set of input rules for creating the basic block quotes, lists,
/// code blocks, and heading.
export function InputRulesPlugin(schema: MarkdownSchema) {
  const rules = smartQuotes.concat(
    blockQuoteRule(schema.nodes.blockquote),
    orderedListRule(schema.nodes.ordered_list),
    bulletListRule(schema.nodes.bullet_list),
    codeBlockRule(schema.nodes.code_block),
    headingRule(schema.nodes.heading, 6),
    insertTaskRule(schema.nodes.task_item),
    insertTableInputRule(schema),
    insertHrInputRule(schema.nodes.horizontal_rule),
    insertImageRule(schema.nodes.image),
    markStrong(schema.marks.strong),
    markEm(schema.marks.em),
    markCode(schema.marks.code),
    markStrike(schema.marks.strike),
    insertLinkRule(schema.marks.link)
  );

  return inputRules({ rules });
}
