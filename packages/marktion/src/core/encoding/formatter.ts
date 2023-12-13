import { Root, Node, RootContent, PhrasingContent, Table, TableRow, Text, AlignType } from 'mdast';
import type { Node as PMNode, Mark } from 'prosemirror-model';
import type { MarkdownSchema } from '../schemas';
import { schema } from '../schemas';
import { createProseMirrorNode } from './utils';

export type FormatMdNode = Root | RootContent | PhrasingContent;
export type ParseContext = {
  paths: FormatMdNode[];
  definitions?: Record<string, { url: string; title: string | null | undefined }>;
  imageReference?: Record<string, PMNode>;
  linkReference?: Record<string, Mark>;
};

export type SerializeContext = {
  getMarkSerialize?: (name: string) => FormatterImpl<GetMdAstNode<string>>;
  paths: PMNode[];
};

export type FormatterImpl<T extends Node> = {
  parse: (node: T, schema: MarkdownSchema, children: PMNode[], context: ParseContext) => PMNode[];
  serialize: (
    node: PMNode,
    children: Extract<T, { children: any }>['children'],
    context: SerializeContext
  ) => T[];
};

export type GetMdAstNode<T> = Extract<FormatMdNode, { type: T }>;

const FormatterMap = new Map<Node['type'], FormatterImpl<Root>>();

export const Formatter = {
  impl<T extends FormatMdNode['type']>(type: T, impl: FormatterImpl<GetMdAstNode<T>>) {
    FormatterMap.set(type, impl as any);
  },

  get<T extends Node['type']>(type: T) {
    return FormatterMap.get(type) as unknown as FormatterImpl<GetMdAstNode<T>>;
  }
};

// root
Formatter.impl('root', {
  parse(node, schema, children) {
    return createProseMirrorNode('doc', schema, children);
  },
  serialize(node, children) {
    return [{ type: 'root', children }];
  }
});

Formatter.impl('paragraph', {
  parse(_, schema, children) {
    return createProseMirrorNode(schema.nodes.paragraph.name, schema, children);
  },
  serialize(_, children) {
    return [{ type: 'paragraph', children: children }];
  }
});

Formatter.impl('blockquote', {
  parse(node, schema, children) {
    return createProseMirrorNode(schema.nodes.blockquote.name, schema, children);
  },
  serialize(node, children) {
    return [
      {
        type: 'blockquote',
        children: children
      }
    ];
  }
});

Formatter.impl('break', {
  parse(node, schema, children) {
    return createProseMirrorNode(schema.nodes.hard_break.name, schema, children);
  },
  serialize() {
    return [{ type: 'break' }];
  }
});

Formatter.impl('code', {
  parse(node, schema) {
    return createProseMirrorNode(schema.nodes.code_block.name, schema, [schema.text(node.value)], {
      language: node.lang
    });
  },
  serialize(node, children: Array<Text>) {
    return [
      {
        type: 'code',
        lang: node.attrs.language,
        value: children.map(child => child.value).join('')
      }
    ];
  }
});

Formatter.impl('definition', {
  parse(node, schema, children, context) {
    if (context.definitions === undefined) {
      context.definitions = {};
    }

    context.definitions[node.identifier] = {
      title: node.title,
      url: node.url
    };

    return [];
  },
  serialize() {
    return [];
  }
});

Formatter.impl('heading', {
  parse(node, schema, children) {
    return createProseMirrorNode(schema.nodes.heading.name, schema, children, {
      level: node.depth
    });
  },
  serialize(node, children) {
    return [
      {
        type: 'heading',
        depth: node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6,
        children
      }
    ];
  }
});

Formatter.impl('thematicBreak', {
  parse(node, schema, children, context) {
    return createProseMirrorNode(schema.nodes.horizontal_rule.name, schema, children);
  },
  serialize() {
    return [
      {
        type: 'thematicBreak'
      }
    ];
  }
});

Formatter.impl('image', {
  parse(node, schema, children, context) {
    return createProseMirrorNode(schema.nodes.image.name, schema, children, {
      src: node.url,
      alt: node.alt,
      title: node.title
    });
  },
  serialize(node) {
    return [
      {
        type: 'image',
        url: node.attrs.src as string,
        ...(node.attrs.alt !== null && { alt: node.attrs.alt as string }),
        ...(node.attrs.title !== null && { title: node.attrs.title as string })
      }
    ];
  }
});

Formatter.impl('imageReference', {
  parse(node, schema, children, context) {
    const proseMirrorNode = schema.nodes.image.createAndFill(
      { src: '', alt: node.alt, title: node.label },
      children
    );

    if (proseMirrorNode === null) return [];

    if (context.imageReference === undefined) {
      context.imageReference = {};
    }

    context.imageReference[node.identifier] = proseMirrorNode;

    return [proseMirrorNode];
  },
  serialize(node, children) {
    return [];
  }
});

Formatter.impl('listItem', {
  parse(node, schema, children, context) {
    if (node.checked !== null) {
      return createProseMirrorNode(schema.nodes.task_item.name, schema, children, {
        checked: node.checked
      });
    }

    return createProseMirrorNode(schema.nodes.list_item.name, schema, children);
  },
  serialize(node, children) {
    if (schema.nodes.task_item === node.type) {
      return [
        {
          type: 'listItem',
          checked: node.attrs['checked'],
          children
        }
      ];
    }

    return [
      {
        type: 'listItem',
        children
      }
    ];
  }
});

Formatter.impl('list', {
  parse(node, schema, children) {
    const first = children[0];

    if (first && first.type.name === schema.nodes.task_item.name) {
      return createProseMirrorNode(schema.nodes.task_list.name, schema, children, {
        spread: node.spread,
        start: node.start ?? 1
      });
    }

    if (node.ordered) {
      return createProseMirrorNode(schema.nodes.ordered_list.name, schema, children, {
        spread: node.spread,
        start: node.start ?? 1
      });
    }

    return createProseMirrorNode(schema.nodes.bullet_list.name, schema, children, {
      spread: node.spread,
      start: node.start ?? 1
    });
  },
  serialize(node, children) {
    const spread = node.attrs.spread as boolean;
    const ordered = node.type.name === schema.nodes.ordered_list.name;

    return [
      {
        type: 'list',
        ordered,
        spread,
        start: node.attrs.start as number,
        children: children.map(child => {
          child.spread = spread;
          return child;
        })
      }
    ];
  }
});

Formatter.impl('table', {
  parse(node, schema, children, context) {
    return createProseMirrorNode(schema.nodes.table.name, schema, children);
  },
  serialize(node, children) {
    const headerRow = node.child(0);
    const headerCell = headerRow?.child(0);

    let aligns: AlignType[] | null = null;

    if (headerCell && headerCell.type.name === schema.nodes.table_header.name) {
      aligns = [];

      for (let i = 0, len = headerRow.childCount; i < len; i++) {
        const align = headerRow.child(i).attrs.align;

        if (align) {
          aligns.push(align);
        }
      }
    }

    return [
      {
        type: 'table',
        align: aligns,
        children
      }
    ];
  }
});

Formatter.impl('tableRow', {
  parse(node, schema, children, context) {
    return createProseMirrorNode(schema.nodes.table_row.name, schema, children);
  },
  serialize(node, children) {
    return [
      {
        type: 'tableRow',
        children
      }
    ];
  }
});

Formatter.impl('tableCell', {
  parse(node, schema, children, context) {
    const row = context.paths[context.paths.length - 1] as TableRow;
    const table = context.paths[context.paths.length - 2] as Table;
    const isFirstRow = table.children[0] === row;

    const nodes = children.map(node => schema.nodes.paragraph.createAndFill({}, node)!);

    if (isFirstRow) {
      let attr: Record<string, any> = {};

      if (table.align) {
        const index = row.children.indexOf(node);
        attr = {
          align: table.align[index]
        };
      }

      return createProseMirrorNode(schema.nodes.table_header.name, schema, nodes, attr);
    }

    return createProseMirrorNode(schema.nodes.table_cell.name, schema, nodes);
  },
  serialize(node, children) {
    return [
      {
        type: 'tableCell',
        children
      }
    ];
  }
});

Formatter.impl('text', {
  parse: (node, schema) => {
    return [schema.text(node.value)];
  },
  serialize(node, children, context) {
    const marks = node.marks;

    if (marks.length > 0) {
      return marks.reduce(
        (children, mark) => {
          const impl = context.getMarkSerialize?.(mark.type.name);

          if (!impl) {
            console.warn(
              'Couldn\'t find any way to serialize ProseMirror node of type "' +
                mark.type.name +
                '" to a unist node.'
            );

            return children;
          }

          return impl.serialize(node, children, context) as Text[];
        },
        [{ type: 'text', value: node.text ?? '' }]
      );
    }

    return [{ type: 'text', value: node.text ?? '' }];
  }
});

Formatter.impl('strong', {
  parse(node, schema, children) {
    return children.map(child => child.mark(child.marks.concat([schema.marks.strong.create()])));
  },
  serialize(node, children) {
    return [{ type: 'strong', children }];
  }
});

Formatter.impl('inlineCode', {
  parse(node, schema) {
    return [schema.text(node.value).mark([schema.marks.code.create()])];
  },
  serialize(node) {
    // TODO: Confirm
    return [{ type: 'inlineCode', value: node.text || '' }];
  }
});

Formatter.impl('emphasis', {
  parse(node, schema, children, context) {
    return children.map(child => child.mark(child.marks.concat([schema.marks.em.create()])));
  },
  serialize(node, children) {
    // TODO: Confirm
    return [{ type: 'emphasis', children }];
  }
});

Formatter.impl('delete', {
  parse(node, schema, children, context) {
    return children.map(child => child.mark(child.marks.concat([schema.marks.strike.create()])));
  },
  serialize(node, children) {
    return [{ type: 'delete', children }];
  }
});

Formatter.impl('link', {
  parse(node, schema, children) {
    return children.map(child =>
      child.mark(
        child.marks.concat([
          schema.marks.link.create({
            href: node.url,
            title: node.title
          })
        ])
      )
    );
  },
  serialize(node, children, context) {
    const linkMark = node.marks[0] || {};

    return [
      {
        type: 'link',
        url: linkMark.attrs.href || '',
        title: linkMark.attrs.title,
        children
      }
    ];
  }
});

Formatter.impl('linkReference', {
  parse(node, schema, children, context) {
    const mark = schema.marks.link.create({
      href: null,
      title: null
    });

    if (context.linkReference === undefined) {
      context.linkReference = {};
    }

    context.linkReference[node.identifier] = mark;

    return children.map(child => child.mark(child.marks.concat([mark])));
  },
  serialize(node, children) {
    // TODO: Confirm
    return [];
  }
});
