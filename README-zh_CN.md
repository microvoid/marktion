# Marktion

Marktion 是一个基于 [tiptap](https://tiptap.dev/) 的所见即所得 Markdown 编辑器。它提供了一种直观的方式来编辑和预览 Markdown 文本，使用户能够创建具有视觉吸引力的文档。

## Features

- [x] AI
- [ ] Auto Link Share

---

- **所见即所得编辑**：实时预览 Markdown 渲染结果，提供直观的编辑体验。
- **Slash 菜单**和 **Bubble 菜单**：通过 Slash 命令菜单和 Bubble 菜单访问常用的格式化选项和命令，灵感来自 Notion 的编辑器。
- **暗黑模式支持**：支持开启或关闭 Dark 模式，以提供在低光环境下的舒适编辑体验。

## 安装和使用

1. 安装依赖项。

```bash
npm intall marktion
```

2. 使用方法

```tsx
import { Marktion } from 'marktion';
import 'marktion/dist/style.css';

function Editor() {
  return <Marktion darkMode={isDarkMode} markdown={`# Hello World`} />;
}
```

3. 示例

您可以查看示例以查看 marktion.io 的实际应用。

## API

### MarktionProps

| **属性**      | **描述**                   | **类型**                                       | **默认值** |
| ------------- | -------------------------- | ---------------------------------------------- | ---------- |
| markdown      | 编辑器的初始 Markdown 内容 | string                                         | -          |
| darkmode      | 是否启用 Dark 模式         | boolean                                        | false      |
| onUploadImage | 处理上传图片的回调函数     | `(file: File, editor: Editor) => Promise<url>` | -          |

请参考 [tiptap 的文档](https://tiptap.dev/installation/react) 以获取更多 API 信息。

### MarktionRef

| **属性**    | **描述**                                                                 | **类型**       | **默认值** |
| ----------- | ------------------------------------------------------------------------ | -------------- | ---------- |
| getMarkdown | 返回当前编辑器中的 Markdown 内容                                         | `() => string` | -          |
| editor      | tiptap 编辑器实例，[**了解更多**](https://tiptap.dev/installation/react) | Editor         | -          |

使用示例：

```tsx
import { MarktionRef, Marktion } from 'marktion';

function App() {
  const marktionRef = useRef<MarktionRef>(null);

  const onExport = () => {
    const content = marktionRef.current?.getMarkdown();
    console.log(content);
  };

  return (
    <>
      <button onClick={onExport}>export</button>
      <Marktion ref={marktionRef} />
    </>
  );
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

- 电子邮件：whistleryz@gmail.com
- Issue Tracker: 项目问题（请在问题标题中注明问题类型）
