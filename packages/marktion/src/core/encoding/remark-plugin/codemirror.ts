// Referer to https://discuss.codemirror.net/t/server-side-rendering-for-read-only-codeblocks-in-cm6/4053/11

import { highlightTree } from '@lezer/highlight';
import { Extension } from '@codemirror/state';
import { HighlightStyle, LRLanguage } from '@codemirror/language';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import { RangeSetBuilder, Text } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { encode } from 'html-entities';

export type HighlightOptions = {
  highlightStyle: HighlightStyle;
  lineNumbers?: boolean;
  langProvider?: LRLanguage;
  theme?: Extension;
};

export function highlightCodeMirror(
  code: string,
  { langProvider, highlightStyle, theme, lineNumbers }: HighlightOptions
) {
  var language = langProvider || javascriptLanguage; // js as default
  var tree = language.parser.parse(code);

  let markCache: Record<string, Decoration> = {};
  let builder = new RangeSetBuilder<Decoration>();

  highlightTree(tree as any, highlightStyle, (from, to, style) => {
    builder.add(
      from,
      to,
      markCache[style] || (markCache[style] = Decoration.mark({ class: style }))
    );
  });

  // just the decorations NOT the code itself
  let decorationRangeSet = builder.finish();

  // just the code content. MUST be array of lines
  var text = Text.of(code.split('\n'));

  var str = '';
  var pos = 0; // keep track of pos

  // loop through each line of code we need to tokenize
  for (var i = 1; i <= text.lines; i++) {
    var line = text.line(i);

    str += '<div class="cm-line">';

    // reset cursor position to beginning of current line
    pos = line.from;

    // iterate through the current line only
    var curs = decorationRangeSet.iter(line.from);
    // pos = line.from; // always start at beginning of the line

    //Q: Do we need to walk the cursor back to pos, or keep track of the tag that was started at the end of the last line?
    // as long as the iterator has a value, and we haven't reached the end of the current line, keep working
    while (curs.value && curs.from < line.to) {
      //if the next token is after the current position, add the non-tokenized text to the string
      if (curs.from > pos) {
        str += `${text.sliceString(pos, curs.from)}`;
        // str += t.slice(pos, curs.from).join("");
      }

      // get token value from the current cursorPos to end of token (BUT NOT to extend the end of the current line)
      let codeVal = text.sliceString(curs.from, Math.min(curs.to, line.to));

      // @ts-ignore
      const { tagName, class: kclass } = curs.value;

      str += `<${tagName} class="${kclass}">${encode(codeVal)}</${tagName}>`;
      pos = curs.to;

      // pos = Math.min(curs.to, line.to); // don't set pos beyond end of current line
      curs.next();
    }

    if (line.to === line.from) {
      // empty line
      str += '<br />';
    }

    // catch up to end of line
    str += `${encode(text.sliceString(pos, line.to))}`;
    pos = line.to; // set pos to end of line...
    // Q: do we need to reset the cursor too?

    str += '</div>'; // closing cm-line div
  }

  var highlightStyles = extractCssRulesFromTheme(highlightStyle, theme);

  let gutterEl = '';
  let gutterClass = '';

  // assemble the gutter markup
  if (lineNumbers) {
    let gutterNumEl = '';

    for (let i = 0; i < text.lines; i++) {
      gutterNumEl += `<div class="cm-gutterElement">${i + 1}</div>`;
    }
    gutterEl = `<div class="cm-gutters">
      <div class="cm-gutter cm-lineNumbers">${gutterNumEl}</div>
      </div>`;

    gutterClass = 'gutter';
  }

  return {
    css: highlightStyles,
    code: `<div class="cm-editor ${gutterClass} ${highlightStyles.scopeClassName}"><div class="cm-scroller">${gutterEl}<div class="cm-content">${str}</div></div></div>`,
    codeLinesOnly: str
  };
}

export function extractCssRulesFromTheme(highlightStyle: HighlightStyle, theme: Extension = []) {
  const rules = [];
  let scopeClassName = '';

  if (Array.isArray(theme)) {
    scopeClassName = theme[0]?.value || ''; // top level custom className for scoping added to `.cm-editor` wrapper el

    // loop through the theme rules (esp for editor. Things like editor bg color, gutter color etc...)
    for (let i = 1; i < theme.length; i++) {
      if (theme[i].value?.getRules?.()) {
        rules.push(theme[i].value.getRules());
      }
    }
  }

  rules.push(highlightStyle.module?.getRules());

  return { rules, scopeClassName };
}

export const baseEditorStyle = `/* Base styles needed for the editor to look functional and work with the gutter. 
On the clientside these are set here as part of the base theme.
https://github.com/codemirror/view/blob/main/src/theme.ts

Feel free to use / override / remove
*/

.cm-editor .cm-line {
  padding: 0 2px 0 6px;
}

.cm-gutters {
  padding-top: 10px; /* MUST be same as .cm-content */
}`;
