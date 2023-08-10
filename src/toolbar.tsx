import { Editor } from '@tiptap/core';
import { Divider, theme } from 'antd';
import { InlineTools } from './plugin-bubble-menu';

export type ToolbarProps = React.PropsWithChildren<{
  editor: Editor;
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
}>;

export function Toolbar(props: ToolbarProps) {
  const { token } = theme.useToken();

  return (
    <div className="marktion-toolbar">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: token.borderRadius,
          padding: token.paddingXS,
          backgroundColor: token.colorBgElevated
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="toolbar-inline-tools">
            <InlineTools editor={props.editor} />
            {props.addonLeft && <Divider type="vertical" />}
          </div>

          {props.addonLeft}
        </div>
        {props.addonRight}
      </div>
    </div>
  );
}
