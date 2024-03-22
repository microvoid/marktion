# Marktion

Marktion 是一个基于 prosemirror 的所见即所得 Markdown 编辑器，致力于 Markdown 的编辑体验提升。

- **\[NEW] ✨ AI 集成**：内置 AI 对话界面，支持 AI 插件扩展，在行首通过 `Space` 唤起；

- **所见即所得编辑**：实时预览 Markdown 渲染结果，提供直观的编辑体验，您可以通过 `Ctrl + /` 切换源码模式与所见即所得编辑模式。

- **Slash 菜单**和 **Bubble 菜单**：通过 `/`  来快速灵感来自 Notion 的编辑器。

- **暗黑模式支持**：支持开启或关闭 Dark 模式。

## 安装和使用

1. 安装依赖项。

```bash
npm intall marktion
```

2. 使用方法

```tsx
import { ReactEditor } from 'marktion';
import 'marktion/dist/style.css';

function Editor() {
  return <ReactEditor content={`# Hello World`} />;
}
```

3. 示例

您可以查看示例以查看 [marktion.io](https://marktion.io/)  的实际应用。

## API

### ReactEditorProps

| **属性**               | **描述**                   | **类型**                                                                                   | **默认值** |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| content                | 编辑器的初始 Markdown 内容 | string                                                                                     | -          |
| dark                   | 是否启用 Dark 模式         | boolean                                                                                    | false      |
| uploadOptions.uploader | 处理上传图片的回调函数     | `(file: File, event: ClipboardEvent \| InputEvent, view: ProsemirrorView) => Promise<url>` | -          |
| renderer               | 渲染模式                   | `WYSIWYG` \| `SOURCE`                                                                      |            |
| onChange               | 当文档内容变化时回调       | `(editor: Marktion) => void`                                                               |            |

请参考 [tiptap 的文档](https://tiptap.dev/installation/react) 以获取更多 API 信息。

### MarktionRef

| **属性**    | **描述**                            | **类型**       | **默认值** |
| ----------- | ----------------------------------- | -------------- | ---------- |
| getMarkdown | 返回当前编辑器中的 Markdown 内容    | `() => string` | -          |
| editor      | tiptap 编辑器实例，[**了解更多**]() | Editor         | -          |

使用示例：

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

> AI Plugin 是基于 vercel ai 实现的，在开始之前，你需要先创建一个 AI router，[参考文档](https://sdk.vercel.ai/docs/getting-started)

使用示例:

```tsx
function Editor() {
  const ai = useAI({
    basePath: import.meta.env.VITE_OPENAI_BASE_URL
  });

  return <ReactEditor ref={editorRef} plugins={[ai.plugin]} />;
}
```

## 贡献

感谢您考虑为 Marktion 做出贡献！如果您希望参与项目，请按照以下步骤：

1. 将仓库 Fork 到您的 GitHub 账户。

2. 将 Fork 的仓库克隆到本地机器。

```bash
git clone https://github.com/yourusername/marktion.git
cd marktion
```

3. 安装依赖项。

```bash
pnpm i
```

4. 进行更改并测试您的修改。

5. 提交您的更改。

6. 创建一个拉取请求。

转到原始仓库并点击“New Pull Request”。填写必要的细节并描述您所做的更改。

我们将尽快审核您的拉取请求。感谢您的贡献！

## 许可证

该项目基于 MIT 许可证。有关更多详细信息，请参阅 [LICENSE](https://github.com/microvoid/marktion/blob/main/LICENSE) 文件。

## 联系方式

如果您有任何疑问、建议或问题，请随时通过以下方式联系我们：

- 电子邮件：<whistleryz@gmail.com>

- Issue Tracker: 项目问题（请在问题标题中注明问题类型）
