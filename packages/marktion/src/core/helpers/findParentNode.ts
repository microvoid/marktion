import { Selection } from 'prosemirror-state';

import { Predicate } from '../types';
import { findParentNodeClosestToPos } from './findParentNodeClosestToPos';
import { ResolvedPos } from 'prosemirror-model';

export function findParentNode(predicate: Predicate) {
  return (pos: ResolvedPos) => findParentNodeClosestToPos(pos, predicate);
}
