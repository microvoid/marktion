import { AuthHelper, postService, projectService } from '@/libs';
import { ModelContextProvider } from '@/clients/context/model-context';

import { Home } from './page-home';

export default async function () {
  const { user, sessionId } = await AuthHelper.getSessionUser();
  const projectUsers = await projectService.getProjectsByUserId(user.id);
  const defaultProject = projectUsers[0];

  const [defaultPosts] = await postService.getPosts({
    projectId: defaultProject.projectId
  });

  return (
    <ModelContextProvider
      defaultValue={{
        user,
        sessionId,
        projects: projectUsers.map(item => {
          return {
            role: item.role,
            project: item.project!
          };
        }),
        posts: defaultPosts
      }}
    >
      <Home />
    </ModelContextProvider>
  );
}
