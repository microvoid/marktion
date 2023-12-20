import { Post } from '@prisma/client';
import { Button, Dropdown } from 'antd';
import { useModelModifier } from '../hooks';
import { Icon } from './icon';

export const EditorPreviewBar = ({ post, onReset }: { post: Post; onReset: () => void }) => {
  const modifier = useModelModifier();

  const items = [
    {
      key: 'download',
      label: `Download`,
      handler() {
        modifier.downloadPost(post);
      }
    },

    {
      key: 'delete',
      danger: true,
      label: 'Delete',
      async handler() {
        await modifier.delPost(post.id);
        modifier.refreshPosts();
      }
    }
  ];

  return (
    <div className="absolute top-1 left-3 right-3 flex justify-between items-center text-sm text-gray-500">
      <div>2022-12-10 21:28:57</div>

      <Dropdown
        menu={{
          items,
          onClick: async ({ key }) => {
            const item = items.find(item => item.key === key);
            item?.handler();
          }
        }}
      >
        <Button
          type="text"
          size="small"
          className="flex items-center justify-center"
          icon={<Icon name="more-horizontal" size={18} />}
        />
      </Dropdown>
    </div>
  );
};
