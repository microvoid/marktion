import { useEffect, useRef } from 'react';
import { MarktionV2 } from 'marktion';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

const TEST = `
1. 111
2. 222

~~123123123~~

4. 444

![](/public/recorder.gif)

| **属性**      | **描述**                   | **类型**                                       | **默认值** |
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

export function MarktionV2App() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    if (rootRef.current && !window['marktionV2']) {
      // @ts-ignore
      window['marktionV2'] = new MarktionV2({
        root: rootRef.current,
        renderer: 'WYSIWYG',
        content: TEST + INIT_MARKDOWN[0]
      });
    }
  }, []);

  return <div className="marktion-themes" data-accent-color="tomato" ref={rootRef}></div>;
}
