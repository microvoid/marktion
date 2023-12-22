'use client';

import { useEffect } from 'react';
import { Pagination, Select, Spin } from 'antd';
import { Header, Footer, Editor } from '@/clients/components';
import { useModelModifier, useModelSelector } from '@/clients';

export function Home() {
  const posts = useModelSelector(ctx => ctx.model.posts);
  const postCount = useModelSelector(ctx => ctx.model.postCount);
  const postsSearchParams = useModelSelector(ctx => ctx.model.postsSearchParams);
  const postsFetchLoading = useModelSelector(ctx => ctx.model.postsFetchLoading);
  const modifier = useModelModifier();
  const dispatch = useModelSelector(ctx => ctx.dispatch);

  useEffect(() => {
    modifier.refreshPosts();
    document.documentElement.scrollTop = 0;
  }, [postsSearchParams]);

  return (
    <>
      <Header />

      <div className="w-full mt-10">
        {/* <div className="mt-[50px] pb-[100px]"> */}
        <div className="mb-6">
          <Editor onResetEditor={modifier.refreshPosts} />
        </div>

        {posts.length > 0 && (
          <div className="mb-2 flex justify-between">
            <Select<(typeof postsSearchParams)['orderBy']>
              value={postsSearchParams.orderBy}
              loading={postsFetchLoading}
              onChange={value => {
                dispatch(draft => {
                  draft.postsSearchParams.orderBy = value;
                });
              }}
              bordered={false}
              options={[
                { value: 'updatedAt', label: 'Last modified' },
                { value: 'createdAt', label: 'Last created' }
              ]}
            />
            <Pagination
              simple
              current={postsSearchParams.page + 1}
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
              <Editor defaultPost={post} onResetEditor={modifier.refreshPosts} />
            </section>
          );
        })}

        <div className="flex justify-end">
          {posts.length > 0 && (
            <Pagination
              current={postsSearchParams.page + 1}
              pageSize={postsSearchParams.pageSize}
              total={postCount}
              onChange={(page, pageSize) => {
                dispatch(draft => {
                  draft.postsSearchParams.page = Math.max(page - 1, 0);
                  draft.postsSearchParams.pageSize = pageSize;
                });
              }}
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
