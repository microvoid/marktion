import { Editor, Extension } from '@tiptap/react';

export enum PluginType {
  intergrate = 'intergrate'
}

export type Methods = Record<string, (...args: any[]) => void>;

export type PluginContext = {
  editor: Editor;
};

export interface IntergrateInstall<M extends Methods = Methods> {
  view?: (ctx: PluginContext) => React.ReactNode;
  methods?: M;
  extension?: Extension;
}

let pluginId = 0;

export function createIntergrateExtension<
  M extends Methods,
  I extends (...args: any[]) => IntergrateInstall<M>
>(install: I) {
  return (...args: Parameters<typeof install>) => {
    const ext = install(...args);

    return {
      ...ext,
      id: pluginId++,
      type: PluginType.intergrate
    };
  };
}

export type PluginCreator = ReturnType<typeof createIntergrateExtension>;
export type Plugin<M extends Methods = Methods> = IntergrateInstall<M> & {
  id: number;
  type: PluginType;
};
