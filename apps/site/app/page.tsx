import { AuthHelper, postService, projectService } from '@/libs';
import {
  ModelContextProvider,
  type ModelContextProviderProps
} from '@/clients/context/model-context';

import { Root } from './page-setting';

export default async function () {
  const user = await AuthHelper.getSessionUser();
  const defaultValue: ModelContextProviderProps['defaultValue'] = {
    user
  };

  if (user) {
    const { posts, projects } = await prepareSessionUser(user.id);

    defaultValue.posts = posts;
    defaultValue.projects = projects;
  }

  return (
    <ModelContextProvider defaultValue={defaultValue}>
      <Root />
    </ModelContextProvider>
  );
}

async function prepareSessionUser(userId: string) {
  const projectUsers = await projectService.getProjectsByUserId(userId);
  const projects = projectUsers.map(item => {
    return {
      role: item.role,
      project: item.project!
    };
  });

  const defaultProject = projectUsers[0]!;
  const [posts] = await postService.getPosts({
    projectId: defaultProject.projectId
  });

  return {
    projects,
    posts
  };
}
