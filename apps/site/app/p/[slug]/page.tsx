import { PostService } from '@/services';
import { MarktionSSR } from './marktion-ssr';

export default async function PostDetail({ params: { slug } }: { params: { slug: string } }) {
  const post = await PostService.getPostBySlugId(slug);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="max-w-screen-lg w-full mt-10">
        {/* <div className="mt-[50px] pb-[100px]"> */}
        <div className="mb-6">
          <MarktionSSR markdown={post?.markdown!} />
        </div>
      </div>
    </main>
  );
}
