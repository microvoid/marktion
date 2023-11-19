import { css } from '@linaria/core';

import { typography } from './variables/typography';
import { space } from './variables/space';
import { scaling } from './variables/scaling';
import { shadow } from './variables/shadow';
import { radius } from './variables/radius';
import { color } from './variables/color';
import { blockquote } from './components/blockquote';
import { heading } from './components/heading';
import { list } from './components/list';
import { table } from './components/table';
import { hr } from './components/hr';
import { slash } from './plugins/slash';
import { bubble } from './plugins/bubble';

/**
 * Create the theme variables from the provided theme.
 * The class name for adding theme styles to the remirror editor.
 */
export const MarktionTheme = css`
  /* The following makes it easier to measure components within the editor. */

  *,
  *:before,
  *:after {
    /** Preserve box-sizing when override exists:
   * https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
   * */
    box-sizing: inherit;
  }

  ${color}
  ${shadow}
  ${scaling}
  ${space}
  ${typography}
  ${radius}

  ${slash}
  ${bubble}

  position: relative;
  box-sizing: border-box;
  overflow-wrap: break-word;
  font-family: var(--default-font-family);
  font-size: var(--default-font-size);
  font-weight: var(--default-font-weight);
  font-style: var(--default-font-style);
  line-height: var(--default-line-height);
  letter-spacing: var(--default-letter-spacing);
  text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .wrapper-wysiwyg,
  .wrapper-source {
    display: none;
  }

  &[data-renderer='WYSIWYG'] .wrapper-wysiwyg {
    display: block;
  }

  &[data-renderer='SOURCE'] .wrapper-source {
    display: block;
  }

  .wrapper-source .cm-editor {
    min-height: var(--space-6);
    box-shadow: var(--shadow-6);
    padding: var(--space-4);
    border-radius: var(--radius-2);
    outline: none;
  }

  .ProseMirror {
    min-height: var(--space-6);
    box-shadow: var(--shadow-6);
    padding: var(--space-4);
    border-radius: var(--radius-2);
    outline: none;

    img,
    video {
      max-width: 100%;
      height: auto;
    }

    ol,
    ul,
    menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    blockquote,
    table,
    ul,
    ol,
    dl,
    dd,
    figure,
    pre {
      margin: var(--space-5) 0;
    }

    p {
      margin: var(--space-3) 0;
    }

    ${blockquote}
    ${heading}
    ${list}
    ${table}
    ${hr}
  }
`;
