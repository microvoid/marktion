import { ConfigurationParameters } from 'openai-edge';
import { Editor } from '@tiptap/core';

export interface AIStorage {
  AIContinueWriting: (editor: Editor, message: string) => void;
  AIAsking: (editor: Editor, message: string) => void;
}

export interface AIOptions {
  openai: ConfigurationParameters;
}
