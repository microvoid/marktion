import { useState } from 'react';
import { MarktionSSR } from '../../../dist';

import '../../../dist/style.css';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

function App() {
  const [lang, setLang] = useState(0);

  return (
    <div style={{ padding: 25 }}>
      <button
        style={{ marginBottom: 10 }}
        onClick={() => {
          const index = Number(!Boolean(lang));

          setLang(index);
        }}
      >
        中文/English
      </button>

      <MarktionSSR markdown={INIT_MARKDOWN[lang]} className="inline-style" />
    </div>
  );
}

export default App;
