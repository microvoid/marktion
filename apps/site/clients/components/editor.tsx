'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { ReactEditor, ReactEditorRef, useAI } from 'marktion';
import { useTheme } from 'next-themes';
import { Post } from '@prisma/client';
import { debounce } from 'lodash';
import { message, Skeleton } from 'antd';

import { EditorPreviewBar } from './editor-preview-bar';
import { useModelModifier, useCurrentProject } from '../hooks';

export type EditorProps = {
  defaultPost?: Post;
  onResetEditor?: () => void;
};

export function Editor({ defaultPost, onResetEditor }: EditorProps) {
  const marktionRef = useRef<ReactEditorRef>(null);
  const { theme } = useTheme();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [post, setPost] = React.useState(defaultPost);
  const modelModifier = useModelModifier();
  const project = useCurrentProject();

  const ai = useAI({
    onError(error) {
      message.error(error.message);
    },

    api: `/api/chat/azure-completions`
  });

  const isDarkMode = theme === 'dark';
  const postId = post?.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onReset = () => {
    setPost(undefined);
    setIsSaving(false);

    marktionRef.current?.editor.setContent('');
    onResetEditor?.();
  };

  const onUpdateOrCreatePost = useMemo(
    () =>
      debounce(async (markdown: string, title: Post['title']) => {
        setIsSaving(true);

        const data: Partial<Post> = {
          publicStats: 'public',
          title,
          projectId: project?.id,
          id: postId,
          markdown
        };

        try {
          const post: Post = await modelModifier.upsertPost(data);

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

  const isPreviewEditor = Boolean(defaultPost);

  return (
    <ReactEditor
      ref={marktionRef}
      className="h-full"
      bordered={false}
      dark={isDarkMode}
      prefix={isPreviewEditor && <EditorPreviewBar post={defaultPost!} />}
      plugins={[ai.plugin]}
      content={post?.markdown || ''}
      uploadOptions={{
        async uploader(files, event, view) {
          const result = await modelModifier.uploadFileInProject({
            file: files[0],
            filename: files[0].name,
            projectId: project?.id
          });

          if (result.status !== 0) {
            message.error(result.message);
            throw result.message;
          }

          return view.state.schema.nodes.image.createAndFill({
            src: result.data.url,
            alt: files[0].name
          })!;
        }
      }}
      onChange={marktion => {
        const content = marktion.getContent();
        const title = getMarktionTitle(content);

        onUpdateOrCreatePost(content, title);
      }}
    >
      {!isMounted && isPreviewEditor && <Skeleton />}
      {ai.element}
    </ReactEditor>
  );
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '');
}
