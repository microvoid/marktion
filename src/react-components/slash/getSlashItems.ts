import { isActive } from '../../core';
import { EditorState } from 'prosemirror-state';
import { getDefaultSlashItems } from './getDefaultSlashItems';
import { getTableSlashItems } from './getTableSlashItems';

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
