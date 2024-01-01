'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { ReactEditor, ReactEditorRef, useAI } from 'marktion';
import { useTheme } from 'next-themes';
import { Post } from '@prisma/client';
import { debounce } from 'lodash';
import fetch from 'axios';
import cls from 'classnames';
import { message, Skeleton } from 'antd';

import { renderSubmitBar } from './editor-submit-bar';
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

    api: `/api/chat/completions`
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
          projectId: project.projectId,
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

  const isDraftEditor = !defaultPost;
  const isPreviewEditor = Boolean(defaultPost);

  return (
    <>
      {isDraftEditor &&
        renderSubmitBar({
          post,
          isSaving,
          onReset
        })}

      <ReactEditor
        ref={marktionRef}
        className={cls({
          ['!pt-10']: isPreviewEditor
        })}
        dark={isDarkMode}
        prefix={isPreviewEditor && <EditorPreviewBar post={defaultPost!} onReset={onReset} />}
        plugins={[ai.plugin]}
        content={post?.markdown || ''}
        uploadOptions={{
          async uploader(files, event, view) {
            const url = await modelModifier.uploadFileInProject({
              file: files[0],
              filename: files[0].name,
              projectId: project.projectId
            });

            return view.state.schema.nodes.image.createAndFill({
              src: url,
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
    </>
  );
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '');
}
