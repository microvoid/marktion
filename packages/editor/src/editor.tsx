import { useState } from "react";

import type { Value } from "@udecode/plate-common";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
  Plate,
  PlateContent,
  usePlateEditor,
} from "@udecode/plate-common/react";
import { HeadingPlugin } from "@udecode/plate-heading/react";
import { MarkdownPlugin } from "@udecode/plate-markdown";

export const basicEditorValue = [
  {
    id: "1",
    children: [
      {
        text: "🌳 Blocks",
      },
    ],
    type: "h1",
  },
  {
    id: "2",
    children: [
      {
        text: "Easily create headings of various levels, from H1 to H6, to structure your content and make it more organized.",
      },
    ],
    type: "p",
  },
  {
    id: "3",
    children: [
      {
        text: "Create blockquotes to emphasize important information or highlight quotes from external sources.",
      },
    ],
    type: "blockquote",
  },
  {
    id: "1",
    children: [
      {
        text: "🌱 Marks",
      },
    ],
    type: "h1",
  },
  {
    id: "2",
    children: [
      {
        text: "Add style and emphasis to your text using the mark plugins, which offers a variety of formatting options.",
      },
    ],
    type: "p",
  },
  {
    id: "3",
    children: [
      {
        text: "Make text ",
      },
      {
        bold: true,
        text: "bold",
      },
      {
        text: ", ",
      },
      {
        italic: true,
        text: "italic",
      },
      {
        text: ", ",
      },
      {
        text: "underlined",
        underline: true,
      },
      {
        text: ", or apply a ",
      },
      {
        bold: true,
        italic: true,
        text: "combination",
        underline: true,
      },
      {
        text: " of these styles for a visually striking effect.",
      },
    ],
    type: "p",
  },
];

const initialMarkdown = `# Markdown syntax guide
## Headers
# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6
## Emphasis
*This text will be italic*  
_This will also be italic_
**This text will be bold**  
__This will also be bold__
_You **can** combine them_
## Lists
### Unordered
* Item 1
* Item 2
* Item 2a
* Item 2b
### Ordered
1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b
## Images
![This is an alt text.](https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "This is a sample image.")
## Links
You may be using [Markdown Live Preview](https://markdownlivepreview.com/).
## Blockquotes
> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
## Tables
| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |
## Blocks of code
\`\`\`js
let message = 'Hello world';
alert(message);
\`\`\`
## Inline code
This web site is using \`plate\`.
## GitHub Flavored Markdown
### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [ ] list syntax required (any unordered or ordered list supported)
### Strikethrough
~~This text is strikethrough~~
### Autolinks
Visit https://github.com automatically converts to a link
Email example@example.com also converts automatically
### Emoji
:smile: :heart:
`;

export function Editor() {
  const [debugValue, setDebugValue] = useState<Value>(basicEditorValue);
  const editor = usePlateEditor({
    plugins: [
      BlockquotePlugin,
      HeadingPlugin,
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      CodePlugin,
      MarkdownPlugin,
    ],
    value: basicEditorValue,
  });
  return (
    <Plate
      onChange={({ value }) => {
        setDebugValue(value);
        // save newValue...
      }}
      editor={editor}
    >
      <PlateContent className="marktion-editor" placeholder="Type..." />
    </Plate>
  );
}
