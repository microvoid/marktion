'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import { MarktionRef, MarktionProps, Marktion } from 'marktion';
import { useTheme } from 'next-themes';
import { Post } from '@prisma/client';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Button, FloatButton } from 'antd';
import { debounce } from 'lodash';
import fetch from 'axios';
import { getPlugins } from './plugins';

export type EditorProps = {
  defaultPost: Post | null;
};

export function Editor({ defaultPost }: EditorProps) {
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
    const content = marktionRef.current?.getMarkdown();

    if (content) {
      const filename = getMarktionTitle(content) || 'marktion';
      downloadFile(`${filename}.md`, content);
    }
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
          Link
        </>
      )}
    </Button>
  );

  return (
    <>
      <div className="max-w-screen-md w-full">
        <div className="mt-[50px] pb-[100px]">
          <Marktion
            ref={marktionRef}
            darkMode={isDarkMode}
            markdown={'\n# Marktion\n\nA simple markdown editor'}
            plugins={plugins}
            onUploadImage={onUploadImage}
            toolbarProps={{
              addonLeft: toolbarAddonLeft
            }}
            onTransaction={({ transaction }) => {
              if (transaction.docChanged) {
                const markdown = marktionRef.current?.getMarkdown()!;
                const title = getMarktionTitle(markdown);

                onUpdateOrCreatePost(markdown, title);
              }
            }}
          >
            <FloatButton tooltip="Export markdwon file" onClick={onExport} />
          </Marktion>
        </div>
      </div>
    </>
  );
}

async function downloadFile(filename: string, content: string) {
  const FileSaver = (await import('file-saver')).default;
  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  });

  return FileSaver.saveAs(blob, filename);
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '');
}
