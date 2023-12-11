[中文](https://github.com/microvoid/marktion/blob/main/README-zh_CN.md)/English

# Introducing Marktion

![](https://github.com/microvoid/marktion/blob/main/public/recorder.gif)

Marktion is a WYSIWYG Markdown editor based on ProseMirror, dedicated to enhancing the editing experience of Markdown.

See our website [marktion.io](https://marktion.io) in action.

## Features

- **\[NEW] ✨ AI integration**: Built-in AI conversation interface, supporting AI plugin extensions, invoked at the beginning of a line by pressing Space;

- **WYSIWYG editing**: Real-time preview of Markdown rendering results, providing an intuitive editing experience, and you can switch between source code mode and WYSIWYG editing mode with Ctrl + /;

- **Slash menu and Bubble menu**: Quickly inspired by the editor of Notion using /; Dark mode support: Support for turning on or off Dark mode.

- **Dark Mode Support**: Enable Dark Mode to provide a visually comfortable editing experience in low-light environments.

## Installation and Usage

1. Install dependencies.

```bash
npm intall marktion
```

2. Usage

```tsx
import { ReactEditor } from 'marktion';
import 'marktion/dist/style.css';

function Editor() {
  return <ReactEditor content={`# Hello World`} />;
}
```

3. Example

Have a look at the examples to see [marktion.io](https://marktion.io) in action.

## API

### ReactEditorProps

| **Property**           | **Description**                              | **Type**                                                                                   | Default |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| content                | The initial Markdown content for the editor. | string                                                                                     | -       |
| dark                   | Enable or disable Dark Mode in the editor.   | boolean                                                                                    | false   |
| uploadOptions.uploader | Callback function for uploading images.      | `(file: File, event: ClipboardEvent \| InputEvent, view: ProsemirrorView) => Promise<url>` | -       |
| render                 | renderer mode                                | `WYSIWYG`\| `SOURCE`                                                                       |         |
| onChange               | editor content change callback               | `(editor: Marktion) => void`                                                               |         |

Consult [tiptap's documentation](https://tiptap.dev/installation/react) to find more APIs.

### MarktionRef

| **Property** | **Description**   | **Type** | Default |
| ------------ | ----------------- | -------- | ------- |
| editor       | marktion instance | Marktion | -       |

Example usage:

```tsx
import { ReactEditor, ReactEditorRef } from 'marktion';

function App() {
  const editorRef = useRef<ReactEditorRef>(null);

  const onExport = () => {
    const content = editorRef.current?.editor.getContent();
    console.log(content);
  };

  return (
    <>
      <button onClick={onExport}>export</button>
      <ReactEditor ref={editorRef} />
    </>
  );
}
```

## Plugins

### AI Plugin

> The AI Plugin is based on Vercel AI. Before you start, you need to create an AI router. Please refer to the documentation for more information: [Getting Started](https://sdk.vercel.ai/docs/getting-started).

Example usage:

```tsx
function Editor() {
  const ai = useAI({
    basePath: import.meta.env.VITE_OPENAI_BASE_URL
  });

  return (
    <ReactEditor ref={editorRef} plugins={[ai.plugin]} />
  )
}
```

## Contributing

Thank you for considering contributing to Marktion! If you would like to contribute, please follow these steps:

1. Fork the repository to your GitHub account.

2. Clone the forked repository to your local machine.

```bash
git clone https://github.com/yourusername/marktion.git
cd marktion
```

3. Install dependencies.

```bash
pnpm i
```

4. Make changes and test your modifications.

5. Commit your changes.

6. Create a pull request.

Go to the original repository and click on "New Pull Request". Fill in the necessary details and describe the changes you made.

We will review your pull request as soon as possible. Thank you for your contribution!

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/microvoid/marktion/blob/main/LICENSE) file for more details.

## Contact

If you have any questions, suggestions, or issues, feel free to reach out to us through the following channels:

- Email: <whistleryz@gmail.com>

- Issue Tracker: Project Issues (Please specify the issue type in the issue title)
