'use client';

import { useModelSelector } from './useModelSelector';

export function useLoginUser() {
  return useModelSelector(ctx => ctx.model.user);
}
