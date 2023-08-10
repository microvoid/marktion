import { ConfigurationParameters } from 'openai-edge';
import { Editor } from '@tiptap/core';

export interface AIStorage {
  AIContinueWriting: (editor: Editor, message: string) => void;
  AIAsking: (editor: Editor, message: string) => void;
  AIChat: (editor: Editor) => void;
}

export interface AIOptions {
  openai: ConfigurationParameters;
  enableAIChat?: boolean;
  enableQuickQuestion?: boolean;
  enableQuickContinueWriting?: boolean;
}
