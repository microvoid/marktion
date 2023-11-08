export const space = `
&:where([data-scaling='90%']) {
  --scaling: 0.9;
}
&:where([data-scaling='95%']) {
  --scaling: 0.95;
}
&:where([data-scaling='100%']) {
  --scaling: 1;
}
&:where([data-scaling='105%']) {
  --scaling: 1.05;
}
&:where([data-scaling='110%']) {
  --scaling: 1.1;
}

--space-1: calc(4px * var(--scaling));
--space-2: calc(8px * var(--scaling));
--space-3: calc(12px * var(--scaling));
--space-4: calc(16px * var(--scaling));
--space-5: calc(24px * var(--scaling));
--space-6: calc(32px * var(--scaling));
--space-7: calc(40px * var(--scaling));
--space-8: calc(48px * var(--scaling));
--space-9: calc(64px * var(--scaling));`;
