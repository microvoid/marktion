export const radius = `
&, &:where([data-radius]) {
  --radius-1: calc(3px * var(--scaling) * var(--radius-factor));
  --radius-2: calc(4px * var(--scaling) * var(--radius-factor));
  --radius-3: calc(6px * var(--scaling) * var(--radius-factor));
  --radius-4: calc(8px * var(--scaling) * var(--radius-factor));
  --radius-5: calc(12px * var(--scaling) * var(--radius-factor));
  --radius-6: calc(16px * var(--scaling) * var(--radius-factor));
}

&:where([data-radius='none']) {
  --radius-factor: 0;
  --radius-full: 0px;
  --radius-thumb: 0.5px;
}

&:where([data-radius='small']) {
  --radius-factor: 0.75;
  --radius-full: 0px;
  --radius-thumb: 0.5px;
}

&, &:where([data-radius='medium']) {
  --radius-factor: 1;
  --radius-full: 0px;
  --radius-thumb: 9999px;
}

&:where([data-radius='large']) {
  --radius-factor: 1.5;
  --radius-full: 0px;
  --radius-thumb: 9999px;
}

&:where([data-radius='full']) {
  --radius-factor: 1.5;
  --radius-full: 9999px;
  --radius-thumb: 9999px;
}`;