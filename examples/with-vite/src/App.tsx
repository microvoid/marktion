import { useRef, useState } from 'react';
import { ReactEditor, ReactEditorRef, ReactSSR, ReactEditorProps } from 'marktion';

import 'marktion/dist/style.css';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

function App() {
  const [lang, setLang] = useState(0);
  const [render, setRenderer] = useState<'SSR' | 'CSR'>('SSR');
  const [darkMode, setDarkMode] = useState<ReactEditorProps['dark']>(false);
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
        Toogle Renderer: {render}
      </button>

      <button
        style={{ margin: 10 }}
        onClick={() => {
          setDarkMode(!darkMode);
        }}
      >
        Toggle DarkMode
      </button>

      {render === 'CSR' && (
        <ReactEditor dark={darkMode} ref={marktionRef} content={INIT_MARKDOWN[lang]} />
      )}
      {render === 'SSR' && <ReactSSR dark={darkMode} content={INIT_MARKDOWN[lang]} />}
    </div>
  );
}

export default App;
