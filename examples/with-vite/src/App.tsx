import { useRef, useState } from 'react';
import { ReactEditor, ReactEditorRef } from 'marktion';

import 'marktion/dist/style.css';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

function App() {
  const [lang, setLang] = useState(0);
  const marktionRef = useRef<ReactEditorRef>(null);

  return (
    <div style={{ padding: 25 }}>
      <button
        style={{ marginBottom: 10 }}
        onClick={() => {
          const index = Number(!Boolean(lang));

          setLang(index);

          marktionRef.current?.editor.setContent(INIT_MARKDOWN[index]);
        }}
      >
        中文/English
      </button>

      <div>
        <ReactEditor ref={marktionRef} content={INIT_MARKDOWN[lang]} />
      </div>
    </div>
  );
}

export default App;
