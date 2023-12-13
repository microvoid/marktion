import { Tag } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useRef, useState } from 'react';
import {
  ReactEditor,
  type ReactEditorProps,
  useAI,
  Marktion,
  ReactEditorRef,
  defaultUploader
} from 'marktion';

import { Article, api } from './api';
import { useMainContextSelector } from './hooks';

const defaultEditorContent = '';

export type MarktionEditorProps = Partial<
  ReactEditorProps & {
    onSave: (article: Article) => void;
  }
>;

export function MarktionEditor(props: MarktionEditorProps) {
  const setDraft = useMainContextSelector(ctx => ctx.setDraft);
  const draft = useMainContextSelector(ctx => ctx.draft);

  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<Article | null>(null);
  const editorRef = useRef<ReactEditorRef>(null);

  useEffect(() => {
    if (draft && draft.id !== current?.id) {
      setCurrent(draft);
      editorRef.current?.editor.setContent(draft.content);
    }
  }, [current, draft]);

  const ai = useAI({
    basePath: import.meta.env.VITE_OPENAI_BASE_URL
  });

  return (
    <div className="marktion-editor-wrapper">
      <ReactEditor
        ref={editorRef}
        className="marktion-editor"
        renderer="WYSIWYG"
        content={defaultEditorContent}
        plugins={[ai.plugin]}
        uploadOptions={{
          uploader(files, event, view) {
            return defaultUploader(files, event, view);
          }
        }}
        onChange={editor => {
          setLoading(true);

          debounceSave({
            editor,
            draft,
            onOk(article) {
              setDraft(article);
              setCurrent(article);
              setLoading(false);
              props.onSave?.(article);
            }
          });
        }}
        {...props}
      >
        {ai.element}
      </ReactEditor>

      {draft && (
        <div className="marktion-editor-status-bar">
          <Tag style={{ marginRight: 0 }}>{loading ? '保存中' : '已保存'}</Tag>
        </div>
      )}
    </div>
  );
}

const debounceSave = debounce(handleSave, 1000);

async function handleSave({
  editor,
  draft,
  onOk
}: {
  editor: Marktion;
  draft: Article | null;
  onOk: (article: Article) => void;
}) {
  const content = editor.getContent();

  if (content === draft?.content) {
    onOk(draft);
    return;
  }

  const owner = await api.getLoginUser();
  const article = await api.upsertArticle(
    {
      content: content,
      owner: owner
    },
    draft?.id
  );

  onOk(article);

  return article;
}
