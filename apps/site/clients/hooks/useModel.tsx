import fetch from 'axios';
import { Post } from '@prisma/client';
import { useImmer, Updater } from 'use-immer';
import React, { useCallback, useRef } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

export type ModelContextType = {
  model: {
    posts: Post[];
    postCount: number;
    postsSearchParams: { page: number; pageSize: number };
  };
  dispatch: Updater<ModelContextType['model']>;
  refreshPosts: () => void;
};

export const ModelContext = createContext({} as ModelContextType);

export function useModelSelector<S>(selector: (ctx: ModelContextType) => S): S {
  return useContextSelector(ModelContext, selector);
}

export function ModelContextProvider(props: React.PropsWithChildren) {
  const [model, dispatch] = useImmer<ModelContextType['model']>({
    posts: [],
    postCount: 0,
    postsSearchParams: {
      page: 0,
      pageSize: 10
    }
  });
  const modelRef = useRef(model);

  modelRef.current = model;

  const refreshPosts = useCallback(async () => {
    const res = await fetch<{ data: { posts: Post[]; count: number } }>({
      url: '/api/post',
      params: modelRef.current.postsSearchParams,
      method: 'get'
    });

    const posts = res.data.data.posts || [];
    const count = res.data.data.count || posts.length;

    dispatch(draft => {
      draft.posts = posts;
      draft.postCount = count;
    });
  }, []);

  return (
    <ModelContext.Provider
      value={{
        model,
        dispatch,

        refreshPosts
      }}
    >
      {props.children}
    </ModelContext.Provider>
  );
}
