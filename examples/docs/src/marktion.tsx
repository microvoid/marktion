import { Marktion, createSlash, ReactEditor } from 'marktion';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

const TEST = `
| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

1. 111
2. 222

~~123123123~~

4. 444

![](/public/recorder.gif)
[百度](https://baidu.com "这是百度")

| 属性      | 描述                   | 类型                                       | 默认值 |
| ------------- | -------------------------- | ---------------------------------------------- | ---------- |
| markdown      | 编辑器的初始 Markdown 内容 | string                                         | -          |
| darkmode      | 是否启用 Dark 模式         | boolean                                        | false      |
| onUploadImage | 处理上传图片的回调函数     | \`(file: File, editor: Editor) => Promise<url>\` | -          |


I just love **bold text**.

I just love __bold text__.

- [x] 123

---

Love**is**bold

Italicized text is the *cat's meow*.

Italicized text is the _cat's meow_

---

*cat's meow*

\`React\`
`;

const marktion = new Marktion({
  renderer: 'WYSIWYG',
  content: TEST + INIT_MARKDOWN[0],
  plugins: [createSlash()]
});

export function MarktionV2App() {
  return <ReactEditor editor={marktion} />;
}
