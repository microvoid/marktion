import { theme, Button, Dropdown, MenuProps } from 'antd';
import { SparklesIcon } from 'lucide-react';
import { MarktionAIEnum } from './constants';

const AIMenuItems: MenuProps['items'] = [
  {
    key: MarktionAIEnum.Translate,
    label: 'Translate',
    children: [
      { key: 'English', label: 'English' },
      { key: 'Korean', label: 'Korean' },
      { key: 'Chinese', label: 'Chinese' },
      { key: 'Japanese', label: 'Japanese' },
      { key: 'Spanish', label: 'Spanish' },
      { key: 'Russian', label: 'Russian' },
      { key: 'French', label: 'French' },
      { key: 'Portuguese', label: 'Portuguese' },
      { key: 'German', label: 'German' },
      { key: 'ltalian', label: 'ltalian' },
      { key: 'Dutch', label: 'Dutch' },
      { key: 'Indonesian', label: 'Indonesian' },
      { key: 'Filipino', label: 'Filipino' },
      { key: 'Vietnamese', label: 'Vietnamese' }
    ]
  },
  {
    key: MarktionAIEnum.ContinueWriting,
    label: 'Continue Writing'
  },
  {
    key: MarktionAIEnum.ImproveWriting,
    label: 'Improve Writing'
  },
  {
    key: MarktionAIEnum.MakeLonger,
    label: 'Make Longer'
  },
  {
    key: MarktionAIEnum.MakeShorter,
    label: 'Make Shorter'
  },
  {
    key: MarktionAIEnum.Summarize,
    label: 'Summarize'
  }
];

export function BubbleAI() {
  const { token } = theme.useToken();

  return (
    <Dropdown
      key="BubbleAI"
      align={{
        offset: [-10, 12]
      }}
      menu={{
        items: AIMenuItems
      }}
    >
      <Button
        icon={
          <SparklesIcon
            style={{
              cursor: 'pointer',
              color: token.purple
            }}
          />
        }
        type="text"
      />
    </Dropdown>
  );
}
