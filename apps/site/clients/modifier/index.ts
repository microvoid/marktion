import { FileModifier } from './file';
import { PostModifier } from './post';
import { ProjectModifier } from './project';
import { StatsModifier } from './stats';

export const ModelModifier = {
  ...PostModifier,
  ...StatsModifier,
  ...FileModifier,
  ...ProjectModifier
};
