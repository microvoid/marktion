import { Range } from '@tiptap/core';
import { ParseOptions } from '@tiptap/pm/model';
import { parse, serialize } from './encoding';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markdown: {
      /**
       * set markdwon content
       */
      setMarkdwon: (content: string, emitUpdate: boolean, parseOptions: ParseOptions) => ReturnType;

      insertMarkdownAt: (
        position: number | Range,
        value: string,
        options?: {
          parseOptions?: ParseOptions;
          updateSelection?: boolean;
        }
      ) => ReturnType;
    };
  }
}

export interface MarkdownOptions {
  html: boolean;
  bulletListMarker: string;
  linkify: boolean;
  breaks: boolean;
  transformPastedText: boolean;
  transformCopiedText: boolean;
}

export interface MarkdownStorage {
  parse: typeof parse;
  serialize: typeof serialize;
}
