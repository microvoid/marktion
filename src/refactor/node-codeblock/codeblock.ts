import { EditorView as MirroView } from '@codemirror/view';
import { NodeViewConstructor, NodeView } from 'prosemirror-view';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

interface Codeblock extends NodeView {
  codeEditor: MirroView;
  node: Parameters<NodeViewConstructor>['0'];
  view: Parameters<NodeViewConstructor>['1'];
  getPos: Parameters<NodeViewConstructor>['2'];
}

export const codeblock: NodeViewConstructor = (node, view, getPos) => {
  const editor = new MirroView({
    doc: node.textContent,
    extensions: [syntaxHighlighting(defaultHighlightStyle)]
  });

  const codeblock: Codeblock = {
    node,
    view,
    getPos,
    codeEditor: editor,
    dom: editor.dom
  };

  return codeblock;
};
