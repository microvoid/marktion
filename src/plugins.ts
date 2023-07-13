import { Editor, Extension } from '@tiptap/react';

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
  view?: (ctx: PluginContext) => React.ReactNode;
  extension?: Extension;
}

let pluginId = 0;

export function createIntergrateExtension<M extends Methods>(
  install: () => IntergrateExtension<M>
) {
  return {
    install,
    id: pluginId++,
    type: PluginType.intergrate
  };
}

export type PluginCreator = ReturnType<typeof createIntergrateExtension>;
