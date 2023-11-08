export const list = `
--prose-counters: var(--gray-12);
--prose-bullets: var(--gray-11);

ul, ol {
  padding-left: var(--space-5);
}

ul {
  list-style-type: disc;
}

ol {
  list-style-type: decimal;
}

ol > li::marker {
  font-weight: 400;
  color: var(--prose-counters);
}
ul > li::marker {
  color: var(--prose-bullets);
}
`;
