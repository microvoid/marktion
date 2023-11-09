import { tableNodes } from 'prosemirror-tables';

export const table = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',

  cellAttributes: {
    align: {
      default: null,
      getFromDOM(dom) {
        return dom.style.textAlign || null;
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `text-align: ${value};`;
        }
      }
    },
    background: {
      default: null,
      getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr(value, attrs) {
        if (value) attrs.style = (attrs.style || '') + `background-color: ${value};`;
      }
    }
  }
});
