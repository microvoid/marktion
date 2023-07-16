'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import { MarktionRef, MarktionProps, Marktion } from 'marktion';
import { RocketIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Post } from '@prisma/client';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Button, Dropdown, FloatButton } from 'antd';
import { debounce, set } from 'lodash';
import fetch from 'axios';
import { getPlugins } from './plugins';
import { PostHandler } from '../handler';
import { HandlerKey } from '../handler/post';

export type EditorProps = {
  defaultPost?: Post;

  mode?: 'create' | 'preview';

  onResetEditor?: () => void;
};

export function Editor({ defaultPost, mode = 'preview', onResetEditor }: EditorProps) {
  const marktionRef = useRef<MarktionRef>(null);
  const { theme } = useTheme();
  const plugins = useMemo(() => getPlugins(), []);
  const [isSaving, setIsSaving] = React.useState(false);
  const [post, setPost] = React.useState(defaultPost);

  const isDarkMode = theme === 'dark';
  const postId = post?.id;

  const onUploadImage = useCallback<NonNullable<MarktionProps['onUploadImage']>>(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const onExport = () => {
    PostHandler.handle('download', post!);
  };

  const onReset = () => {
    marktionRef.current?.editor.commands.clearContent();
    setPost(undefined);
    setIsSaving(false);

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

  const toolbarAddonLeft = (isSaving || postId) && (
    <Button type="link" loading={isSaving} className="underline" target="_blank" href={postUrl}>
      {postId && (
        <>
          <OpenInNewWindowIcon className="inline mr-1" />
          Link({post?.slug})
        </>
      )}
    </Button>
  );

  const createModeActionMenu = () => {
    return (
      <Button onClick={onReset} type="text" icon={<RocketIcon className="inline-block" />}></Button>
    );
  };

  const previewModeActionMenu = () => {
    const items = [
      {
        key: 'download',
        label: `Export ${post?.title}.md file`
      },

      {
        key: 'delete',
        danger: true,
        label: 'Delete'
      }
    ];

    return (
      <Dropdown
        menu={{
          items,
          onClick: async ({ key }) => {
            await PostHandler.handle(key as HandlerKey, post!);

            if (['delete'].includes(key)) {
              onResetEditor?.();
            }
          }
        }}
      >
        <Button type="text" icon={<DotsHorizontalIcon className="inline-block" />}></Button>
      </Dropdown>
    );
  };

  return (
    <Marktion
      ref={marktionRef}
      darkMode={isDarkMode}
      plugins={plugins}
      markdown={post?.markdown || ''}
      onUploadImage={onUploadImage}
      toolbarProps={{
        addonLeft: toolbarAddonLeft,
        addonRight: mode === 'create' ? createModeActionMenu() : previewModeActionMenu()
      }}
      onTransaction={({ transaction }) => {
        if (transaction.docChanged) {
          const markdown = marktionRef.current?.getMarkdown()!;
          const title = getMarktionTitle(markdown);

          onUpdateOrCreatePost(markdown, title);
        }
      }}
    />
  );
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '');
}
