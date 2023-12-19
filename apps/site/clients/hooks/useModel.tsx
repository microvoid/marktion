import { Post } from '@prisma/client';
import { useImmer, Updater } from 'use-immer';
import React, { useEffect, useMemo, useRef } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { type User } from '@prisma/client';
import { UserStatistics } from '..';
import { ExtraModifier } from './utils-types';
import { ModelModifier } from './modifier';

export type LoginUser = User;

export type ModelContextType = {
  model: {
    user: User;
    posts: Post[];
    postCount: number;
    postsFetchLoading: boolean;
    postsSearchParams: {
      page: number;
      pageSize: number;
      orderBy: 'createdAt' | 'updatedAt';
      order: 'desc';
    };

    userStatisticsLoading: boolean;
    userStatistics: UserStatistics;
  };
  dispatch: Updater<ModelContextType['model']>;
};

export const ModelContext = createContext({} as ModelContextType);

export function ModelContextProvider({ children, user }: React.PropsWithChildren<{ user: User }>) {
  const [model, dispatch] = useImmer<ModelContextType['model']>({
    user,
    posts: [],
    postCount: 0,
    postsFetchLoading: false,
    postsSearchParams: {
      orderBy: 'updatedAt',
      order: 'desc',
      page: 0,
      pageSize: 10
    },

    userStatisticsLoading: false,
    userStatistics: {
      postCount: 0
    }
  });
  const modelRef = useRef(model);

  modelRef.current = model;

  useEffect(() => {
    // @ts-ignore
    window['model'] = modelRef;
  }, []);

  return (
    <ModelContext.Provider
      value={{
        model,
        dispatch
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModelSelector<S>(selector: (ctx: ModelContextType) => S): S {
  return useContextSelector(ModelContext, selector);
}

type UseModelModifierReturn = ExtraModifier<typeof ModelModifier>;

export function useModelModifier(): UseModelModifierReturn {
  const ref = useRef<ModelContextType>();

  useModelSelector(ctx => {
    ref.current = ctx;
    return null;
  });

  return useMemo(() => {
    const modifier = {} as UseModelModifierReturn;

    Object.keys(ModelModifier).forEach(key => {
      modifier[key as keyof UseModelModifierReturn] = (...args: any[]) => {
        // @ts-ignore
        return ModelModifier[key as keyof UseModelModifierReturn](ref.current, ...args);
      };
    });

    return modifier;
  }, []);
}
