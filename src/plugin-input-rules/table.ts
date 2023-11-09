import { Node } from 'prosemirror-model';
import { MarkdownSchema } from '../core';

export function createTable(schema: MarkdownSchema, r = 3, c = 3): Node {
  const cells = Array(c)
    .fill(0)
    .map(() => schema.nodes.table_cell.createAndFill()!);
  const headerCells = Array(c)
    .fill(0)
    .map(() => schema.nodes.table_header.createAndFill()!);
  const rows = Array(r)
    .fill(0)
    .map((_, index) => schema.nodes.table_row.create(null, index === 0 ? headerCells : cells)!);

  return schema.nodes.table.create(null, rows);
}
