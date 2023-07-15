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
    <div className="absolute top-2 left-0 w-full">
      <Affix offsetTop={top} onChange={setIsAffixed}>
        <div
          className={`bg-white dark:bg-black px-6 py-1 flex items-center justify-between ${
            isAffixed ? 'border-b rounded-md h-[60px]' : ''
          }`}
        >
          <div className="hidden sm:block">
            <InlineTools editor={props.editor} />
            {props.addonLeft && <Divider type="vertical" />}
            {props.addonLeft}
          </div>
          {props.addonRight}
        </div>
      </Affix>
    </div>
  );
}
