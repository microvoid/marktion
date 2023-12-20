import { Post } from '@prisma/client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button, Dropdown } from 'antd';

export const EditorPreviewBar = ({ post, onReset }: { post: Post; onReset: () => void }) => {
  const items = [
    {
      key: 'download',
      label: `Export ${post?.title}.md file`,
      handler() {}
    },

    {
      key: 'delete',
      danger: true,
      label: 'Delete'
    }
  ];

  return (
    <div className="absolute top-1 left-3 text-sm text-gray-500">
      <div>2022-12-10 21:28:57</div>

      <Dropdown
        menu={{
          items,
          onClick: async ({ key }) => {
            if (['delete'].includes(key)) {
              onReset?.();
            }
          }
        }}
      >
        <Button type="text" icon={<DotsHorizontalIcon className="inline-block" />}></Button>
      </Dropdown>
    </div>
  );
};
