'use client';

import { useEffect, useState } from 'react';
import fetch from 'axios';
import { Post } from '@prisma/client';
import { AntdProvider } from '../provider';
import { Editor } from './editor';
import { Header } from './header';

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  const refreshPosts = async () => {
    const res = await fetch({
      url: '/api/post',
      method: 'get'
    });

    const posts: Post[] = res.data.data || [];

    setPosts(posts);
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <AntdProvider>
      <Header />

      <div className="max-w-screen-lg w-full mt-10">
        {/* <div className="mt-[50px] pb-[100px]"> */}
        <div className="mb-6">
          <Editor mode="create" onResetEditor={refreshPosts} />
        </div>

        {posts.map(post => {
          return (
            <section className="mb-4" key={post.id}>
              <Editor defaultPost={post} onResetEditor={refreshPosts} />
            </section>
          );
        })}
      </div>
    </AntdProvider>
  );
}
