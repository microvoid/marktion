import { isActive } from '../../core';
import { EditorState } from 'prosemirror-state';
import { SlashItem, getDefaultSlashItems } from './getDefaultSlashItems';
import { getTableSlashItems } from './getTableSlashItems';
import { SlashItemKey } from '.';

export const getSlashItems = (query?: string, state?: EditorState) => {
  if (!query || !state) {
    return getDefaultSlashItems();
  }

  const isTableActive = isActive(state, 'table');
  const suggestions = isTableActive ? getTableSlashItems() : getDefaultSlashItems();

  query = query.slice(1);

  return suggestions.filter(item => {
    if (typeof query === 'string' && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

export const SlashItemMap = (() => {
  const items = getDefaultSlashItems();
  const tableItems = getTableSlashItems();
  const map = {} as Record<SlashItemKey, SlashItem>;

  items.forEach(item => {
    map[item.key] = item;
  });

  tableItems.forEach(item => {
    map[item.key] = item;
  });

  return map;
})();
