import ReactDOM, { createPortal } from 'react-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { Updater, useImmer } from 'use-immer';
import { Select } from 'antd';

import { codemirror, CodeMirrorNodeView } from '../../plugin-codemirror';

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
            lang: node.getLanguage(),
            langs: node.getLanguages()
          });

          dispathRef.current = dispath;

          useEffect(() => {
            node.setLanguage(setting.lang);
          }, [setting]);

          return <Toolbar setting={setting} dispatch={dispath} />;
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

  return useMemo(() => {
    return {
      plugin,
      element: toolbars
    };
  }, [toolbars]);
}

type ToolbarSetting = {
  lang: string;
  langs: ReturnType<CodeMirrorNodeView['getLanguages']>;
};

type ToolbarProps = {
  setting: ToolbarSetting;
  dispatch: Updater<ToolbarSetting>;
};

function Toolbar({ setting, dispatch }: ToolbarProps) {
  const [state, setState] = useImmer({
    isFocus: false
  });

  return (
    <Select
      onFocus={() =>
        setState(draft => {
          draft.isFocus = true;
        })
      }
      onBlur={() =>
        setState(draft => {
          draft.isFocus = false;
        })
      }
      showSearch
      size="small"
      variant="filled"
      placeholder="Select a language"
      optionFilterProp="children"
      placement="bottomRight"
      style={{
        minWidth: state.isFocus ? 100 : undefined
      }}
      dropdownStyle={{
        minWidth: state.isFocus ? 100 : undefined
      }}
      value={setting.lang}
      onChange={value => {
        dispatch(draft => {
          draft.lang = value;
        });
      }}
      filterOption={(input, option) => {
        const filters = [option?.label, ...(option?.alias || [])];
        return Boolean(filters.find(item => item?.includes(input)));
      }}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
      options={useMemo(
        () =>
          setting.langs.map(item => {
            return {
              alias: item.alias,
              value: item.name,
              label: item.name
            };
          }),
        [setting.langs]
      )}
    />
  );
}
