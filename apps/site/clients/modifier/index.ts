import { PostModifier } from './post';
import { StatsModifier } from './stats';

export const ModelModifier = {
  ...PostModifier,
  ...StatsModifier
};
