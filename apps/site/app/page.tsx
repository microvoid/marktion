import { AuthHelper, postService, projectService } from '@/libs';
import { ModelContextProvider } from '@/clients/context/model-context';

import { Home } from './page-home';

export default async function () {
  const { user, sessionId } = await AuthHelper.getSessionUser();
  const projects = await projectService.getProjectsByUserId(user.id);
  const defaultProject = projects[0];

  const [defaultPosts] = await postService.getPosts({
    projectId: defaultProject.id
  });

  return (
    <ModelContextProvider
      defaultValue={{
        user,
        sessionId,
        projects,
        posts: defaultPosts
      }}
    >
      <Home />
    </ModelContextProvider>
  );
}
