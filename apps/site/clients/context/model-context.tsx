'use client';

import { Post } from '@prisma/client';
import { useImmer, Updater } from 'use-immer';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createContext } from 'use-context-selector';
import { type User } from '@prisma/client';
import { GUEST_SESSION_ID } from '@/clients';
import { setCookie } from 'cookies-next';
import dayjs from 'dayjs';
import { UserStatistics } from '@/common';

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

export type ModelContextProviderProps = {
  defaultValue?: Partial<ModelContextType['model']>;
};

export function ModelContextProvider({
  children,
  defaultValue
}: React.PropsWithChildren<ModelContextProviderProps>) {
  const [model, dispatch] = useImmer<ModelContextType['model']>({
    posts: [],
    postCount: 0,
    postsFetchLoading: false,
    postsSearchParams: {
      orderBy: 'createdAt',
      order: 'desc',
      page: 0,
      pageSize: 10
    },

    userStatisticsLoading: false,
    userStatistics: {
      postCount: 0
    },

    ...defaultValue,
    user: defaultValue?.user!
  });

  const modelRef = useRef(model);

  modelRef.current = model;

  useEffect(() => {
    // @ts-ignore
    window['model'] = modelRef;
  }, []);

  useLayoutEffect(() => {
    if (model.user.anonymous) {
      setCookie(GUEST_SESSION_ID, model.user.id, {
        expires: dayjs().add(5, 'year').toDate(),
        path: '/'
      });
    }
  }, [model.user]);

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
