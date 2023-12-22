import { AuthHelper, postService } from '@/libs';
import { ModelContextProvider } from '@/clients/context/model-context';

import { Home } from './page-home';

export default async function () {
  const user = await AuthHelper.getSessionUser();
  const [defaultPosts] = await postService.getPostsByUserId(user.id);

  return (
    <ModelContextProvider
      defaultValue={{
        user,
        posts: defaultPosts
      }}
    >
      <Home />
    </ModelContextProvider>
  );
}
