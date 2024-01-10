'use client';

import { Post, Project, ProjectUserRole } from '@prisma/client';
import { useImmer, Updater } from 'use-immer';
import React, { useEffect, useRef } from 'react';
import { createContext } from 'use-context-selector';
import { type User } from '@prisma/client';
import { ProjectStatistics, UserStatistics } from '@/common';

export type ModelContextType = {
  model: {
    projects: { role: ProjectUserRole; project: Project }[];
    user?: User | null;
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
    projectStatistics: ProjectStatistics | null;
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
  const { projects = [] } = defaultValue;

  const [model, dispatch] = useImmer<ModelContextType['model']>({
    posts: [],
    projects: [],
    postCount: 0,
    postsFetchLoading: false,
    postsSearchParams: {
      projectId: projects[0]?.project.id || null,
      orderBy: 'createdAt',
      order: 'desc',
      page: 0,
      pageSize: 10
    },

    userStatisticsLoading: false,
    userStatistics: {
      postCount: 0
    },
    projectStatistics: null,

    ...defaultValue
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
