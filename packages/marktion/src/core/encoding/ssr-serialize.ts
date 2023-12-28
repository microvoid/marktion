import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import { h, fragment, Props } from 'snabbdom';
import toHTML from 'snabbdom-to-html';
import { VNodeChildren, VNodeChildElement } from 'snabbdom/build/h';
import { DOMOutputSpec, Schema, Fragment, Node, Mark } from 'prosemirror-model';
import { parse } from './parse';

export class HtmlSerializer {
  static renderSpec(structure: DOMOutputSpec, wraps?: VNodeChildren): VNodeChildren {
    if (isString(structure)) {
      return structure;
    }

    if (isArray(structure)) {
      const tag = structure[0];
      const attrs = structure[1];
      const props: Props = {};

      let children: VNodeChildElement[] = [];
      let curIndex = 1;

      if (isPlainObject(attrs) && !isArray(attrs)) {
        curIndex = 2;

        for (const name in attrs) {
          if (attrs[name] != null) {
            props[name] = attrs[name];
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

  constructor(public schema: Schema) {}

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

    return toDOM && HtmlSerializer.renderSpec(toDOM(node), children);
  }

  mark(mark: Mark, inline: boolean, children: VNodeChildren) {
    const toDOM = mark.type.spec.toDOM;

    console.log(toDOM?.(mark, inline));

    return toDOM && HtmlSerializer.renderSpec(toDOM(mark, inline), children);
  }
}

function defaultTextToDOM(node: Node): DOMOutputSpec {
  return node.text!;
}
