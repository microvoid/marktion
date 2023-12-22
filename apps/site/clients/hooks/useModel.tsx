'use client';

import { useMemo, useRef } from 'react';
import { useContextSelector } from 'use-context-selector';
import { type User } from '@prisma/client';

import { ExtraModifier } from './utils-types';
import { ModelModifier } from './modifier';
import { ModelContext, ModelContextType } from '../context/model-context';

export type LoginUser = User;

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
      // @ts-ignore
      modifier[key as keyof UseModelModifierReturn] = (...args: any[]) => {
        // @ts-ignore
        return ModelModifier[key as keyof UseModelModifierReturn](ref.current, ...args);
      };
    });

    return modifier;
  }, []);
}
