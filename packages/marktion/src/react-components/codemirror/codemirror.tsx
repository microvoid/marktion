import React, { useMemo, useState } from 'react';
import { Updater, useImmer } from 'use-immer';
import { codemirror } from '../../plugin-codemirror';
import ReactDOM, { createPortal } from 'react-dom';

export function useCodemirror() {
  const [toolbars, setToolbars] = useState<React.ReactNode[]>([]);

  const plugin = useMemo(() => {
    return codemirror({
      createToolbar(node) {
        const el = node.dom.ownerDocument.createElement('div');

        let dispathRef = {
          current: null as null | Updater<ToolbarProps['setting']>
        };

        el.classList.add('components-codeblock-setting');
        node.dom.appendChild(el);

        const reactToolbar = createPortal(<Wrapper />, el);

        setToolbars(toolbars => [...toolbars, reactToolbar]);

        function Wrapper() {
          const [setting, dispath] = useImmer<ToolbarProps['setting']>({
            lang: node.getLanguage()
          });

          dispathRef.current = dispath;

          return <Toolbar setting={setting} />;
        }

        return {
          update(node) {
            dispathRef.current?.(draft => {
              draft.lang = node.attrs.language;
            });
          },
          destory() {
            setToolbars(toolbars => toolbars.filter(item => item !== reactToolbar));
            ReactDOM.unmountComponentAtNode(el);
          }
        };
      }
    });
  }, []);

  console.log('toolbars', toolbars);

  return useMemo(() => {
    return {
      plugin,
      element: toolbars
    };
  }, [toolbars]);
}

type ToolbarProps = {
  setting: {
    lang: string;
  };
};

function Toolbar({ setting }: ToolbarProps) {
  return <span>{setting.lang}</span>;
}
