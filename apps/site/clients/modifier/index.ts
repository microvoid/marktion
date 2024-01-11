import * as PostModifier from './post';
import { FileModifier } from './file';
import { ProjectModifier } from './project';
import { StatsModifier } from './stats';

export const ModelModifier = {
  ...PostModifier,
  ...StatsModifier,
  ...FileModifier,
  ...ProjectModifier
};
