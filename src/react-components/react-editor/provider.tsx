import { ConfigProvider, theme } from 'antd';
import { violetA } from '@radix-ui/colors';

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
          colorLinkHover: violetA.violetA5,
          colorLinkActive: violetA.violetA5,
          colorLink: violetA.violetA6,
          colorPrimary: violetA.violetA6
        },
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <MarktionContext.Provider value={editor}>{children}</MarktionContext.Provider>
    </ConfigProvider>
  );
}
