import { keymap } from 'prosemirror-keymap';
import {
  wrapIn,
  setBlockType,
  chainCommands,
  toggleMark,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode
} from 'prosemirror-commands';
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Command } from 'prosemirror-state';
import { MarkdownSchema } from '../schemas';

const mac = typeof navigator != 'undefined' ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false;

export function KeymapPlugin(schema: MarkdownSchema, mapKeys?: { [key: string]: false | string }) {
  return keymap({
    ...buildKeymap(schema, mapKeys)
  });
}

/// Inspect the given schema looking for marks and nodes from the
/// basic schema, and if found, add key bindings related to them.
/// This will add:
///
/// * **Mod-b** for toggling [strong](#schema-basic.StrongMark)
/// * **Mod-i** for toggling [emphasis](#schema-basic.EmMark)
/// * **Mod-`** for toggling [code font](#schema-basic.CodeMark)
/// * **Ctrl-Shift-0** for making the current textblock a paragraph
/// * **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
///   textblock a heading of the corresponding level
/// * **Ctrl-Shift-Backslash** to make the current textblock a code block
/// * **Ctrl-Shift-8** to wrap the selection in an ordered list
/// * **Ctrl-Shift-9** to wrap the selection in a bullet list
/// * **Ctrl->** to wrap the selection in a block quote
/// * **Enter** to split a non-empty textblock in a list item while at
///   the same time splitting the list item
/// * **Mod-Enter** to insert a hard break
/// * **Mod-_** to insert a horizontal rule
/// * **Backspace** to undo an input rule
/// * **Alt-ArrowUp** to `joinUp`
/// * **Alt-ArrowDown** to `joinDown`
/// * **Mod-BracketLeft** to `lift`
/// * **Escape** to `selectParentNode`
///
/// You can suppress or map these bindings by passing a `mapKeys`
/// argument, which maps key names (say `"Mod-B"` to either `false`, to
/// remove the binding, or a new key name string.

export function buildKeymap(schema: MarkdownSchema, mapKeys?: { [key: string]: false | string }) {
  const KeyMap: { [key: string]: Command } = {};

  function bind(key: string, cmd: Command) {
    if (mapKeys) {
      let mapped = mapKeys[key];
      if (mapped === false) return;
      if (mapped) key = mapped;
    }
    KeyMap[key] = cmd;
  }

  bind('Mod-z', undo);
  bind('Shift-Mod-z', redo);

  bind('Backspace', undoInputRule);

  if (!mac) bind('Mod-y', redo);

  bind('Alt-ArrowUp', joinUp);
  bind('Alt-ArrowDown', joinDown);
  bind('Mod-BracketLeft', lift);

  bind('Escape', selectParentNode);

  bind('Mod-b', toggleMark(schema.marks.strong));
  bind('Mod-B', toggleMark(schema.marks.strong));

  bind('Mod-i', toggleMark(schema.marks.em));
  bind('Mod-I', toggleMark(schema.marks.em));

  bind('Mod-`', toggleMark(schema.marks.code));

  bind('Shift-Ctrl-8', wrapInList(schema.nodes.bullet_list));
  bind('Shift-Ctrl-9', wrapInList(schema.nodes.ordered_list));
  bind('Ctrl->', wrapIn(schema.nodes.blockquote));

  const br = schema.nodes.hard_break;
  const exitCodeChain = chainCommands(exitCode, (state, dispatch) => {
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
    }

    return true;
  });

  bind('Mod-Enter', exitCodeChain);
  bind('Shift-Enter', exitCodeChain);

  if (mac) {
    bind('Ctrl-Enter', exitCodeChain);
  }

  bind(
    'Enter',
    chainCommands(splitListItem(schema.nodes.list_item), splitListItem(schema.nodes.task_item))
  );
  bind(
    'Mod-[',
    chainCommands(liftListItem(schema.nodes.list_item), liftListItem(schema.nodes.task_item))
  );
  bind(
    'Mod-]',
    chainCommands(sinkListItem(schema.nodes.list_item), sinkListItem(schema.nodes.task_item))
  );

  bind('Shift-Ctrl-0', setBlockType(schema.nodes.paragraph));
  bind('Shift-Ctrl-\\', setBlockType(schema.nodes.code_block));

  for (let i = 1; i <= 6; i++) {
    bind('Shift-Ctrl-' + i, setBlockType(schema.nodes.heading, { level: i }));
  }

  const hr = schema.nodes.horizontal_rule;

  bind('Mod-_', (state, dispatch) => {
    if (dispatch) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
    return true;
  });

  return KeyMap;
}
