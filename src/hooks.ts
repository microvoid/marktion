import { Editor } from '@tiptap/react';
import React from 'react';

export const RootElContext =
  React.createContext<React.MutableRefObject<HTMLDivElement | null> | null>({ current: null });

export const EditorContext = React.createContext<Editor | null>(null);

export const useRootElRef = () => React.useContext(RootElContext)!;
export const useEditor = () => React.useContext(EditorContext)!;
