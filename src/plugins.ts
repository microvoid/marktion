import { Editor } from '@tiptap/react';

export enum PluginType {
  intergrate = 'intergrate'
}

export type Methods = Record<string, (...args: any[]) => void>;

export interface Plugin<M extends Methods = Methods> {
  methods?: M;
}

export type PluginContext = {
  editor: Editor;
};

export interface IntergrateExtension<M extends Methods = Methods> extends Plugin<M> {
  view: () => React.ReactNode;
}

export function createIntergrateExtension<M extends Methods>(
  install: (ctx: PluginContext) => IntergrateExtension<M>
) {
  return {
    install,
    type: PluginType.intergrate
  };
}

export type PluginCreator = ReturnType<typeof createIntergrateExtension>;
