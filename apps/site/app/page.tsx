import { AuthHandler, postService } from '@/libs';
import { Home } from './page-home';

export default async function () {
  const user = await AuthHandler.autoGuestAuth();
  const [defaultPosts] = await postService.getPostsByUserId(user.id);

  return <Home defaultPosts={defaultPosts} />;
}
