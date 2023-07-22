import { PostService } from '@/services';
import { parse, serialize } from 'marktion';

export default async function PostDetail({ params: { slug } }: { params: { slug: string } }) {
  const post = await PostService.getPostBySlugId(slug);
  return <div dangerouslySetInnerHTML={{ __html: parse(post?.markdown || '') }}></div>;
}
