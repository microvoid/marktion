import { EditorState, Transaction } from 'prosemirror-state';
import { Mark, Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export type ValuesOf<T> = T[keyof T];

export type KeysWithTypeOf<T, Type> = { [P in keyof T]: T[P] extends Type ? P : never }[keyof T];

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type JSONContent = {
  type?: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};
export type HTMLContent = string;
export type Content = HTMLContent | JSONContent | JSONContent[] | null;

export type Command = (props: CommandProps) => boolean;

export type CommandProps = {
  tr: Transaction;
  commands: SingleCommands;
  can: () => CanCommands;
  chain: () => ChainedCommands;
  state: EditorState;
  view: EditorView;
  dispatch: ((args?: any) => any) | undefined;
};

export type CanCommands = SingleCommands & { chain: () => ChainedCommands };

export type UnionCommands<T = Command> = UnionToIntersection<
  ValuesOf<Pick<Commands<T>, KeysWithTypeOf<Commands<T>, {}>>>
>;

export type RawCommands = {
  [Item in keyof UnionCommands]: UnionCommands<Command>[Item];
};

export type SingleCommands = {
  [Item in keyof UnionCommands]: UnionCommands<boolean>[Item];
};

export type ChainedCommands = {
  [Item in keyof UnionCommands]: UnionCommands<ChainedCommands>[Item];
} & {
  run: () => boolean;
};

declare global {
  interface Commands<ReturnType = any> {}
}

export type AnyCommands = Record<string, (...args: any[]) => Command>;

export type FocusPosition = 'start' | 'end' | 'all' | number | boolean | null;

export type Range = {
  from: number;
  to: number;
};

export type NodeRange = {
  node: Node;
  from: number;
  to: number;
};

export type MarkRange = {
  mark: Mark;
  from: number;
  to: number;
};

export type Predicate = (node: Node) => boolean;

export interface NodeConfig<Options = any, Storage = any> {}
