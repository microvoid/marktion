'use client';

import { useEffect } from 'react';
import { Editor } from './editor';
import { Header } from './header';
import { Pagination, Select } from 'antd';
import { useModelSelector } from '@/clients';

export function Home() {
  const posts = useModelSelector(ctx => ctx.model.posts);
  const postCount = useModelSelector(ctx => ctx.model.postCount);
  const postsSearchParams = useModelSelector(ctx => ctx.model.postsSearchParams);
  const refreshPosts = useModelSelector(ctx => ctx.refreshPosts);
  const dispatch = useModelSelector(ctx => ctx.dispatch);

  useEffect(() => {
    refreshPosts();
  }, [postsSearchParams]);

  return (
    <>
      <Header />

      <div className="max-w-screen-lg w-full mt-10">
        {/* <div className="mt-[50px] pb-[100px]"> */}
        <div className="mb-6">
          <Editor mode="create" onResetEditor={refreshPosts} />
        </div>

        {posts.length > 0 && (
          <div className="mb-2 flex justify-between">
            <Select
              defaultValue="filter-last-created"
              bordered={false}
              options={[
                { value: 'filter-last-modified', label: 'Last modified' },
                { value: 'filter-last-created', label: 'Last created' }
              ]}
            />
            <Pagination
              simple
              defaultCurrent={postsSearchParams.page + 1}
              pageSize={postsSearchParams.pageSize}
              total={postCount}
              onChange={(page, pageSize) => {
                dispatch(draft => {
                  draft.postsSearchParams.page = Math.max(page - 1, 0);
                  draft.postsSearchParams.pageSize = pageSize;
                });
              }}
            />
          </div>
        )}

        {posts.map(post => {
          return (
            <section className="mb-4" key={post.id}>
              <Editor defaultPost={post} onResetEditor={refreshPosts} />
            </section>
          );
        })}
      </div>
    </>
  );
}
