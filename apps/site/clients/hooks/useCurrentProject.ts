import { useModelSelector } from './useModelSelector';

export function useCurrentProject() {
  return useModelSelector(ctx => ctx.model.projects[0]?.project);
}
