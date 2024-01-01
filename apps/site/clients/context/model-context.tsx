'use client';

import { Post, ProjectUsers } from '@prisma/client';
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
    projects: ProjectUsers[];
    user: User;
    sessionId: string | null;
    posts: Post[];
    postCount: number;
    postsFetchLoading: boolean;
    postsSearchParams: {
      projectId: string | null;
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
  defaultValue = {}
}: React.PropsWithChildren<ModelContextProviderProps>) {
  const { projects, user } = defaultValue;
  const [model, dispatch] = useImmer<ModelContextType['model']>({
    posts: [],
    projects: [],
    postCount: 0,
    sessionId: null,
    postsFetchLoading: false,
    postsSearchParams: {
      projectId: projects![0]?.id || null,
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
    user: user!
  });

  const modelRef = useRef(model);

  modelRef.current = model;

  useEffect(() => {
    // @ts-ignore
    window['model'] = modelRef;
  }, []);

  useLayoutEffect(() => {
    if (model.sessionId) {
      setCookie(GUEST_SESSION_ID, model.sessionId, {
        expires: dayjs().add(10, 'year').toDate(),
        path: '/'
      });
    }
  }, [model.sessionId]);

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
