import { Editor } from '@tiptap/core';
import { Affix, Divider } from 'antd';
import { useState } from 'react';
import { InlineTools } from './plugin-bubble-menu';

export type ToolbarProps = React.PropsWithChildren<{
  editor: Editor;
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
}>;

export function Toolbar(props: ToolbarProps) {
  const [top] = useState(0);
  const [isAffixed, setIsAffixed] = useState<Boolean>();

  return (
    <div className="absolute top-0 left-0 w-full overscroll-x-auto">
      <Affix offsetTop={top} onChange={setIsAffixed}>
        <div
          className={`bg-white dark:bg-black px-2 py-2 flex items-center rounded-md justify-between ${
            isAffixed ? 'border-b h-[60px]' : ''
          }`}
        >
          <div className="flex items-center">
            <div className="sm:inline-block">
              <InlineTools editor={props.editor} />
              {props.addonLeft && <Divider type="vertical" />}
            </div>

            {props.addonLeft}
          </div>
          {props.addonRight}
        </div>
      </Affix>
    </div>
  );
}
