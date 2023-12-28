import { useRef, useState } from 'react';
import { ReactEditor, ReactEditorRef, ReactSSR } from 'marktion';

import 'marktion/dist/style.css';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

function App() {
  const [lang, setLang] = useState(0);
  const [render, setRenderer] = useState<'SSR' | 'CSR'>('SSR');
  const marktionRef = useRef<ReactEditorRef>(null);

  return (
    <div style={{ padding: 25 }}>
      <button
        style={{ margin: 10 }}
        onClick={() => {
          const index = Number(!Boolean(lang));

          setLang(index);

          marktionRef.current?.editor.setContent(INIT_MARKDOWN[index]);
        }}
      >
        中文/English
      </button>

      <button
        style={{ margin: 10 }}
        onClick={() => {
          setRenderer(value => (value === 'SSR' ? 'CSR' : 'SSR'));
        }}
      >
        {render}
      </button>

      {render === 'CSR' && <ReactEditor ref={marktionRef} content={INIT_MARKDOWN[lang]} />}
      {render === 'SSR' && <ReactSSR content={INIT_MARKDOWN[lang]} />}
    </div>
  );
}

export default App;
