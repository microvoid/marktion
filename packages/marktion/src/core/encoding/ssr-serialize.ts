import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import { h, fragment, VNodeData, VNode } from 'snabbdom';
import toHTML from 'snabbdom-to-html';
import { VNodeChildren, VNodeChildElement } from 'snabbdom/build/h';
import { DOMOutputSpec, Schema, Fragment, Node, Mark } from 'prosemirror-model';
import { parse } from './parse';
import { highlight } from './highlight';

export type StoreComponent = Record<
  string,
  (node: Node, children: VNodeChildren, serializer: HtmlSerializer) => VNodeChildren
>;

export class HtmlSerializer {
  static renderSpec(structure: DOMOutputSpec, wraps?: VNodeChildren): VNodeChildren {
    if (isString(structure)) {
      return structure;
    }

    if (isArray(structure)) {
      const tag = structure[0];
      const attrs = structure[1];
      const props: VNodeData = {
        attrs: {}
      };

      let children: VNodeChildElement[] = [];
      let curIndex = 1;

      if (isPlainObject(attrs) && !isArray(attrs)) {
        curIndex = 2;

        for (const name in attrs) {
          if (attrs[name] != null) {
            props.attrs![name] = attrs[name];
          }
        }
      }

      for (let i = curIndex; i < structure.length; i++) {
        const child = structure[i];

        if (child === 0) {
          // console.warn(!(i < structure.length - 1 || i > curIndex), {
          //   message: 'Content hole (0) must be the only child of its parent node'
          // });

          return h(tag, props, wraps);
        }

        children = children.concat(HtmlSerializer.renderSpec(child, wraps));
      }

      return h(tag, props, wraps);
    }

    return [];
  }

  constructor(
    public schema: Schema,
    public storeComponent: StoreComponent = defaultStoreCompent
  ) {}

  serialize(markdown: string) {
    const doc = parse(markdown);
    const fragement = this.fragment(doc.content);
    const html = toHTML(fragement);

    return html.replace(/^<div>/, '').replace(/<\/div>$/, '');
  }

  fragment(content: Fragment) {
    let children: VNodeChildElement[] = [];

    content.forEach(node => {
      let child: VNodeChildren = this.node(node);

      [...node.marks].reverse().forEach(mark => {
        child = this.mark(mark, node.isInline, child);
      });

      children = children.concat(child);
    });

    return fragment(children);
  }

  node(node: Node) {
    let toDOM = node.type.spec.toDOM;

    if (!toDOM && node.type.name === 'text') {
      toDOM = defaultTextToDOM;
    }

    let children: VNodeChildren;

    if (node.content.childCount > 0) {
      const root = this.fragment(node.content);
      children = root.children;
    }

    const component = this.storeComponent[node.type.name];
    if (component) {
      return component(node, children, this);
    }

    return toDOM && HtmlSerializer.renderSpec(toDOM(node), children);
  }

  mark(mark: Mark, inline: boolean, children: VNodeChildren) {
    const toDOM = mark.type.spec.toDOM;

    return toDOM && HtmlSerializer.renderSpec(toDOM(mark, inline), children);
  }
}

export const defaultStoreCompent: StoreComponent = {
  code_block: (node, children) => {
    const toDOM = node.type.spec.toDOM;

    if (Array.isArray(children)) {
      children.forEach(item => {
        const vnode = item as VNode;
        const language = node.attrs.language;

        if (vnode.text && language) {
          vnode.text = highlight(language, vnode.text);
        }
      });
    }

    return toDOM && HtmlSerializer.renderSpec(toDOM(node), children);
  }
};

function defaultTextToDOM(node: Node): DOMOutputSpec {
  return node.text!;
}
