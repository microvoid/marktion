import { fonts } from './font';

export const typography = `${fonts}
--font-size-1: calc(12px * var(--scaling));
--font-size-2: calc(14px * var(--scaling));
--font-size-3: calc(16px * var(--scaling));
--font-size-4: calc(18px * var(--scaling));
--font-size-5: calc(20px * var(--scaling));
--font-size-6: calc(24px * var(--scaling));
--font-size-7: calc(28px * var(--scaling));
--font-size-8: calc(35px * var(--scaling));
--font-size-9: calc(60px * var(--scaling));

--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

--line-height-1: calc(16px * var(--scaling));
--line-height-2: calc(20px * var(--scaling));
--line-height-3: calc(24px * var(--scaling));
--line-height-4: calc(26px * var(--scaling));
--line-height-5: calc(28px * var(--scaling));
--line-height-6: calc(30px * var(--scaling));
--line-height-7: calc(36px * var(--scaling));
--line-height-8: calc(40px * var(--scaling));
--line-height-9: calc(60px * var(--scaling));

--letter-spacing-1: 0.0025em;
--letter-spacing-2: 0em;
--letter-spacing-3: 0em;
--letter-spacing-4: -0.0025em;
--letter-spacing-5: -0.005em;
--letter-spacing-6: -0.00625em;
--letter-spacing-7: -0.0075em;
--letter-spacing-8: -0.01em;
--letter-spacing-9: -0.025em;

/* default values */

--default-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto,
  'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji',
  'Segoe UI Emoji';
--default-font-size: var(--font-size-3); /* Same size used for \`<Text size="3">\` */
--default-font-style: normal;
--default-font-weight: var(--font-weight-regular);
--default-line-height: 1.5; /* Equivalent to the line-height used for \`<Text size="3">\` 16px * 1.5 = 24px */
--default-letter-spacing: 0em;
--default-leading-trim-start: 0.42em;
--default-leading-trim-end: 0.36em;

/* Heading */

--heading-font-family: var(--default-font-family);
--heading-font-size-adjust: 1;
--heading-font-style: normal;
--heading-leading-trim-start: var(--default-leading-trim-start);
--heading-leading-trim-end: var(--default-leading-trim-end);
--heading-letter-spacing: 0em;

--heading-line-height-1: calc(16px * var(--scaling));
--heading-line-height-2: calc(18px * var(--scaling));
--heading-line-height-3: calc(22px * var(--scaling));
--heading-line-height-4: calc(24px * var(--scaling));
--heading-line-height-5: calc(26px * var(--scaling));
--heading-line-height-6: calc(30px * var(--scaling));
--heading-line-height-7: calc(36px * var(--scaling));
--heading-line-height-8: calc(40px * var(--scaling));
--heading-line-height-9: calc(60px * var(--scaling));

/* Code */

--code-font-family: 'Menlo', 'Consolas (Custom)', 'Bitstream Vera Sans Mono', monospace,
  'Apple Color Emoji', 'Segoe UI Emoji';
--code-font-size-adjust: 0.95;
--code-font-style: normal;
--code-font-weight: inherit;
--code-letter-spacing: -0.007em;
--code-padding-top: 0.1em;
--code-padding-bottom: 0.1em;

/* Strong */

--strong-font-family: var(--default-font-family);
--strong-font-size-adjust: 1;
--strong-font-style: inherit;
--strong-font-weight: var(--font-weight-bold);
--strong-letter-spacing: 0em;

/* Em */

--em-font-family: 'Times New Roman', 'Times', serif;
--em-font-size-adjust: 1.18;
--em-font-style: italic;
--em-font-weight: inherit;
--em-letter-spacing: -0.025em;

/* Quote */

--quote-font-family: 'Times New Roman', 'Times', serif;
--quote-font-size-adjust: 1.18;
--quote-font-style: italic;
--quote-font-weight: inherit;
--quote-letter-spacing: -0.025em;

/* Tabs */

--tabs-trigger-active-letter-spacing: -0.01em;
--tabs-trigger-active-word-spacing: 0em;
--tabs-trigger-inactive-letter-spacing: 0em;
--tabs-trigger-inactive-word-spacing: 0em;
`;
