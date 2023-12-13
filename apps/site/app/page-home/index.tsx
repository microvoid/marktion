'use client';

import fetch from 'axios';
import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import { AntdProvider } from '../provider';
import { Editor } from './editor';
import { Header } from './header';
import { Button, Pagination, Select } from 'antd';

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

        <div className="mb-4 flex justify-between">
          <Select
            defaultValue="filter-last-created"
            style={{ width: 120 }}
            bordered={false}
            options={[
              { value: 'filter-last-modified', label: 'last modified' },
              { value: 'filter-last-created', label: 'last created' }
            ]}
          />
          <Pagination simple defaultCurrent={2} total={50} />
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
