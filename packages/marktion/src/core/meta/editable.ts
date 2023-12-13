import { isUndefined } from 'lodash';
import { Transaction } from 'prosemirror-state';

export function getEditable(tr: Transaction, defaultValue = true): boolean {
  const editable = tr.getMeta('editable');

  if (isUndefined(editable)) {
    return defaultValue;
  }

  return editable;
}

export function setEditable(tr: Transaction, editable: boolean) {
  return tr.setMeta('editable', editable);
}
