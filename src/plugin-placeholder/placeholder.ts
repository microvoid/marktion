import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

export type PlaceholderPluginState = {
  active: boolean;
};

export type PlaceholderOptions = {
  /**
   * **The class name for the empty editor**
   * @default 'is-editor-empty'
   */
  emptyEditorClass: string;

  /**
   * **The class name for empty nodes**
   * @default 'is-empty'
   */
  emptyNodeClass: string;

  /**
   * **The placeholder content**
   *
   * You can use a function to return a dynamic placeholder or a string.
   * @default 'Write something …'
   */
  placeholder:
    | ((PlaceholderProps: { node: Node; pos: number; hasAnchor: boolean }) => string)
    | string;

  /**
   * **Used for empty check on the document.**
   *
   * If true, any node that is not a leaf or atom will be considered for empty check.
   * If false, only default nodes (paragraphs) will be considered for empty check.
   * @default false
   */
  considerAnyAsEmpty: boolean;

  /**
   * **Checks if the placeholder should be only shown when the editor is editable.**
   *
   * If true, the placeholder will only be shown when the editor is editable.
   * If false, the placeholder will always be shown.
   * @default true
   */
  showOnlyWhenEditable: boolean;

  /**
   * **Checks if the placeholder should be only shown when the current node is empty.**
   *
   * If true, the placeholder will only be shown when the current node is empty.
   * If false, the placeholder will be shown when any node is empty.
   * @default true
   */
  showOnlyCurrent: boolean;

  /**
   * **Controls if the placeholder should be shown for all descendents.**
   *
   * If true, the placeholder will be shown for all descendents.
   * If false, the placeholder will only be shown for the current node.
   * @default false
   */
  includeChildren: boolean;
};

const PlaceholderPluginKey = new PluginKey<PlaceholderPluginState>('plugin-placeholder');

const defaultOptions = {
  emptyEditorClass: 'is-editor-empty',
  emptyNodeClass: 'is-empty',
  placeholder: 'Write something …',
  showOnlyWhenEditable: true,
  considerAnyAsEmpty: false,
  showOnlyCurrent: true,
  includeChildren: false
};

export function placeholder(options: Partial<PlaceholderOptions> = {}) {
  let editorView: EditorView | null = null;

  options = {
    ...defaultOptions,
    ...options
  };

  return new Plugin<PlaceholderPluginState>({
    key: PlaceholderPluginKey,
    state: {
      init(config, instance) {
        return {
          active: false
        };
      },
      apply(tr, value) {
        return value;
      }
    },
    view(view) {
      editorView = view;

      return {
        destroy() {
          editorView = null;
        }
      };
    },
    props: {
      decorations: ({ doc, selection }) => {
        if (!editorView) {
          return null;
        }

        const active = editorView.editable || !options.showOnlyWhenEditable;
        const { anchor } = selection;
        const decorations: Decoration[] = [];

        if (!active) {
          return null;
        }

        // only calculate isEmpty once due to its performance impacts (see issue #3360)
        const { firstChild } = doc.content;
        const isLeaf = firstChild && firstChild.type.isLeaf;
        const isAtom = firstChild && firstChild.isAtom;
        const isValidNode = options.considerAnyAsEmpty
          ? true
          : firstChild && firstChild.type.name === doc.type.contentMatch.defaultType?.name;
        const isEmptyDoc =
          doc.content.childCount <= 1 &&
          firstChild &&
          isValidNode &&
          firstChild.nodeSize <= 2 &&
          (!isLeaf || !isAtom);

        doc.descendants((node, pos) => {
          const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
          const isEmpty = !node.isLeaf && !node.childCount;

          if ((hasAnchor || !options.showOnlyCurrent) && isEmpty) {
            const classes = [options.emptyNodeClass];

            if (isEmptyDoc) {
              classes.push(options.emptyEditorClass);
            }

            const decoration = Decoration.node(pos, pos + node.nodeSize, {
              class: classes.join(' '),
              'data-placeholder':
                typeof options.placeholder === 'function'
                  ? options.placeholder({
                      node,
                      pos,
                      hasAnchor
                    })
                  : options.placeholder
            });

            decorations.push(decoration);
          }

          return options.includeChildren;
        });

        return DecorationSet.create(doc, decorations);
      }
    }
  });
}
