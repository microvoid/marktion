import { css } from '@linaria/core';

import { defaultThemeVariables } from './theme-variables';
import { getThemeVar } from './utils';
import { typography } from './variables/typography';
import { space } from './variables/space';
import { scaling } from './variables/scaling';

/**
 * Create the theme variables from the provided theme.
 * The class name for adding theme styles to the remirror editor.
 */
export const MarktionTheme = css`
  /* The following makes it easier to measure components within the editor. */
  box-sizing: border-box;

  *,
  *:before,
  *:after {
    /** Preserve box-sizing when override exists:
   * https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
   * */
    box-sizing: inherit;
  }

  ${scaling}
  ${space}
  ${typography}

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

  .ProseMirror {
    min-height: ${getThemeVar('space', 6)};
    box-shadow: ${getThemeVar('color', 'border')} 0px 0px 0px 0.1em;
    padding: ${getThemeVar('space', 3)};
    border-radius: ${getThemeVar('radius', 'border')};
    outline: none;

    img,
    video {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      border-left: var(--space-1) solid var(--rmr-color-border);
      padding-left: var(--space-3);
    }

    blockquote,
    dl,
    dd,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    figure,
    p,
    pre {
      margin: 0;
    }
  }
`;
