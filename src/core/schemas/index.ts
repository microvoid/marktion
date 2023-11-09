import { Schema, MarkSpec } from 'prosemirror-model';
import { paragraph } from './paragraph';
import { blockquote } from './blockquote';
import { horizontal_rule } from './horizontal_rule';
import { heading } from './heading';
import { ordered_list } from './ordered_list';
import { code_block } from './code_block';
import { bullet_list } from './bullet_list';
import { list_item } from './list_item';
import { image } from './image';
import { hard_break } from './hard_break';
import { em } from './em';
import { strong } from './strong';
import { link } from './link';
import { code } from './code';
import { table } from './table';
import { task_item } from './task_item';
import { task_list } from './task_list';
import { strike } from './strike';

export const nodes = {
  doc: {
    content: 'block+'
  },

  paragraph,
  blockquote,
  horizontal_rule,

  ...table,

  heading,
  code_block,

  task_item,
  task_list,

  ordered_list,
  bullet_list,
  list_item,

  text: {
    group: 'inline'
  },

  image,
  hard_break
};

export const marks = {
  em,
  strong,
  link,
  code,
  strike
};

/// Document schema for the data model used by CommonMark.
export const schema = new Schema({
  nodes,
  marks
});

export type MarkdownSchema = typeof schema;
export type MarkdownMark = MarkdownSchema extends Schema<infer N, infer M> ? M : never;
export type MarkdownNode = MarkdownSchema extends Schema<infer N, infer M> ? N : never;
