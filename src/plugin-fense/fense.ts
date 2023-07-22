import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { lowlight } from 'lowlight';

import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import shell from 'highlight.js/lib/languages/shell';
import rust from 'highlight.js/lib/languages/rust';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import objectivec from 'highlight.js/lib/languages/objectivec';
import ruby from 'highlight.js/lib/languages/ruby';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import go from 'highlight.js/lib/languages/go';
import cpp from 'highlight.js/lib/languages/cpp';

import { LanguageSelector } from './language-selector';

lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('jsx', js);
lowlight.registerLanguage('ts', ts);
lowlight.registerLanguage('tsx', ts);
lowlight.registerLanguage('shell', shell);
lowlight.registerLanguage('rust', rust);
lowlight.registerLanguage('java', java);
lowlight.registerLanguage('go', go);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('objectivec', objectivec);
lowlight.registerLanguage('ruby', ruby);
lowlight.registerLanguage('csharp', csharp);
lowlight.registerLanguage('php', php);
lowlight.registerLanguage('c++', cpp);

export const FenseExtension = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(LanguageSelector);
  }
}).configure({ lowlight });
