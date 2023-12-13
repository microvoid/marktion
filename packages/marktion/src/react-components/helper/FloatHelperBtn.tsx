import { FloatButton } from 'antd';
import { HelpCircleIcon } from 'lucide-react';
import { HelperMenu } from './HelperMenu';

export function FloatHelperBtn() {
  return (
    <FloatButton.Group shape="square">
      <HelperMenu>
        <FloatButton
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => console.log('onClick')}
          icon={<HelpCircleIcon size={18} />}
        />
      </HelperMenu>
    </FloatButton.Group>
  );
}
