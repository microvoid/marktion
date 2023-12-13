'use client';

import React, { useMemo, useRef } from 'react';
import { ReactEditor, ReactEditorRef, useAI, defaultUploader } from 'marktion';
import { useTheme } from 'next-themes';
import { Post } from '@prisma/client';
import { debounce } from 'lodash';
import fetch from 'axios';
import { PostHandler } from '@/clients';
import { RocketIcon } from '@radix-ui/react-icons';
import { Button } from 'antd';

export type EditorProps = {
  defaultPost?: Post;
  onResetEditor?: () => void;
};

export function Editor({ defaultPost, onResetEditor }: EditorProps) {
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

  const postUrl = post ? `${location.origin}/p/${post.slug}` : '';

  return (
    <>
      {!defaultPost && (
        <div className="h-[40px] flex justify-end items-center mb-1">
          {postUrl && (
            <Button
              type="text"
              loading={isSaving}
              className="underline"
              target="_blank"
              onClick={onReset}
              icon={<RocketIcon className="inline-block" />}
            >
              {/* {postId && (
              <>
                <OpenInNewWindowIcon className="inline mr-1" />
                Link({post?.slug})
              </>
            )} */}
            </Button>
          )}
        </div>
      )}
      <ReactEditor
        ref={marktionRef}
        dark={isDarkMode}
        plugins={[ai.plugin]}
        content={post?.markdown || ''}
        uploadOptions={{
          async uploader(files, event, view) {
            const data = new FormData();
            data.set('file', files[0]);
            data.set('filename', files[0].name);

            const response = await fetch<{ data: { url: string } }>(`/api/upload`, {
              method: 'POST',
              data
            });

            return view.state.schema.nodes.image.createAndFill({
              src: response.data.data.url,
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
