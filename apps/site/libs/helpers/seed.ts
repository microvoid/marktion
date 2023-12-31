import { postService, projectService } from '@/libs/services';
import { Project, User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { UserFirstMarkdown } from '@/libs/constants';

class SeedHelper {
  async seedUserDefaultProject(user: User) {
    const project = await projectService.createProject(user.id, {
      name: `${user.name}'s project`,
      slug: nanoid(10)
    });

    await this.seedProjectFirstPost(user, project);
  }

  async seedProjectFirstPost(admin: User, project: Project) {
    return postService.upsert({
      title: 'Hello marktion',
      markdown: UserFirstMarkdown,
      userId: admin.id,
      projectId: project.id
    });
  }
}

export const seedHelper = new SeedHelper();
