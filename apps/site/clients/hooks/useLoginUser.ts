import { useModelSelector } from './useModel';

export function useLoginUser() {
  return useModelSelector(ctx => ctx.model.user);
}
