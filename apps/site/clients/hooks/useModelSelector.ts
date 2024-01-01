'use client';

import { useContextSelector } from 'use-context-selector';
import { type User } from '@prisma/client';

import { ModelContext, ModelContextType } from '../context/model-context';

export type LoginUser = User;

export function useModelSelector<S>(selector: (ctx: ModelContextType) => S): S {
  return useContextSelector(ModelContext, selector);
}
