import { postService } from '@/libs';
import { SSREditor } from './ssr-editor';

export default async function PostDetail({ params: { id } }: { params: { id: string } }) {
  const post = await postService.getPostById(id);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="max-w-screen-lg w-full mt-10">
        {/* <div className="mt-[50px] pb-[100px]"> */}
        <div className="mb-6">
          <SSREditor content={post?.markdown || ''} />
        </div>
      </div>
    </main>
  );
}
