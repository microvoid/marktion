import { useMemo, useRef, useState } from 'react';
import { getPlugins } from './plugins';
import { Marktion, MarktionRef } from '../../../dist';

import '../../../dist/style.css';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

function App() {
  const [lang, setLang] = useState(0);
  const plugins = useMemo(() => getPlugins(), []);
  const marktionRef = useRef<MarktionRef>(null);

  return (
    <div style={{ padding: 25 }}>
      <button
        style={{ marginBottom: 10 }}
        onClick={() => {
          const index = Number(!Boolean(lang));

          setLang(index);

          marktionRef.current?.editor.commands.setMarkdwon(INIT_MARKDOWN[index]);
        }}
      >
        中文/English
      </button>

      <div>
        <Marktion ref={marktionRef} markdown={INIT_MARKDOWN[lang]} plugins={plugins} />
      </div>
    </div>
  );
}

export default App;
