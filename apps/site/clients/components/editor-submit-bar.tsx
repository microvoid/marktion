import { RocketIcon } from '@radix-ui/react-icons';
import { Post } from '@prisma/client';
import { Button } from 'antd';

export const renderSubmitBar = ({
  isSaving,
  post,
  onReset
}: {
  isSaving: boolean;
  post?: Post;
  onReset: () => void;
}) => {
  const postUrl = post ? `${location.origin}/p/${post.slug}` : '';

  return (
    <div className="h-[40px] flex justify-end items-center mb-1">
      {postUrl && (
        <Button
          type="default"
          loading={isSaving}
          className="underline"
          target="_blank"
          onClick={onReset}
          icon={<RocketIcon className="inline-block" />}
        >
          Submit
        </Button>
      )}
    </div>
  );
};
