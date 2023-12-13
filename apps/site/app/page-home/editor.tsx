'use client';

import React, { useMemo, useRef } from 'react';
import { ReactEditor, ReactEditorRef, useAI, defaultUploader } from 'marktion';
import { useTheme } from 'next-themes';
import { Post } from '@prisma/client';
import { debounce } from 'lodash';
import fetch from 'axios';
import { PostHandler } from '@/clients';

export type EditorProps = {
  defaultPost?: Post;
  mode?: 'create' | 'preview';
  onResetEditor?: () => void;
};

export function Editor({ defaultPost, mode = 'preview', onResetEditor }: EditorProps) {
  const marktionRef = useRef<ReactEditorRef>(null);
  const { theme } = useTheme();
  const [isSaving, setIsSaving] = React.useState(false);
  const [post, setPost] = React.useState(defaultPost);
  const ai = useAI({
    basePath: '/api'
  });

  const isDarkMode = theme === 'dark';
  const postId = post?.id;

  const onExport = () => {
    PostHandler.handle('download', post!);
  };

  const onReset = () => {
    setPost(undefined);
    setIsSaving(false);

    onResetEditor?.();
    marktionRef.current?.editor.setContent('');
  };

  const onUpdateOrCreatePost = useMemo(
    () =>
      debounce(async (markdown: string, title: Post['title']) => {
        setIsSaving(true);

        const data: Partial<Post> = {
          publicStats: 'public',
          title,
          id: postId,
          markdown
        };

        try {
          const res = await fetch({
            url: '/api/post',
            method: 'post',
            data
          });

          const post: Post = res.data.data;

          if (!postId) {
            setPost(post);
          }

          setIsSaving(false);
        } catch (err) {
          setIsSaving(false);
        }
      }, 1000),
    [postId]
  );

  return (
    <ReactEditor
      ref={marktionRef}
      dark={isDarkMode}
      plugins={[ai.plugin]}
      content={post?.markdown || ''}
      uploadOptions={{
        uploader(files, event, view) {
          return defaultUploader(files, event, view);
        }
      }}
      onChange={marktion => {
        const content = marktion.getContent();
        const title = getMarktionTitle(content);

        onUpdateOrCreatePost(content, title);
      }}
    >
      {ai.element}
    </ReactEditor>
  );
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '');
}
