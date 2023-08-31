import { EditorVisual, EditorVisualProps } from './editor-visual';
import { EditorCombi, EditorCombiProps } from './editor-combi';
import { MarktionCtxProps, MarktionCtxProvider } from './provider';
import { EditorSource, EditorSourceProps } from './editor-source';

export function MarktionCombi({
  darkMode,
  mode,
  markdown,
  ...props
}: EditorCombiProps & MarktionCtxProps) {
  return (
    <MarktionCtxProvider darkMode={darkMode} mode={mode} markdown={markdown}>
      <EditorCombi {...props} />
    </MarktionCtxProvider>
  );
}

export function MarktionVisual({
  darkMode,
  mode,
  markdown,
  ...props
}: EditorVisualProps & MarktionCtxProps) {
  return (
    <MarktionCtxProvider darkMode={darkMode} mode={mode} markdown={markdown}>
      <EditorVisual {...props} />
    </MarktionCtxProvider>
  );
}

export function MarktionSource({
  darkMode,
  mode,
  markdown,
  ...props
}: EditorSourceProps & MarktionCtxProps) {
  return (
    <MarktionCtxProvider darkMode={darkMode} mode={mode} markdown={markdown}>
      <EditorSource value={markdown} {...props} />
    </MarktionCtxProvider>
  );
}
