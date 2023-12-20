import React from 'react';
import { ConfigProvider, theme } from 'antd';

import { Marktion } from '../../marktion';
import { MarktionContext } from '../../react-hooks';
import { getPortalRoot } from '../../plugin-portal';

export type ReactEditorProviderProps = React.PropsWithChildren<{ editor: Marktion; dark: boolean }>;

export function ReactEditorProvider({ editor, dark, children }: ReactEditorProviderProps) {
  return (
    <ConfigProvider
      getPopupContainer={() => getPortalRoot(editor.pmRenderer.state) || document.body}
      theme={{
        token: {
          colorPrimary: '#722ed1'
        },
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <MarktionContext.Provider value={editor}>{children}</MarktionContext.Provider>
    </ConfigProvider>
  );
}
