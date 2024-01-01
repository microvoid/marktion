import {
  PLANS_PROJECT_SPACE_SIZI,
  ProjectStatistics,
  UserStatistics,
  fileService,
  prisma,
  projectService
} from '@/libs';

class StatsHelper {
  async getUserStatistics(id: string): Promise<UserStatistics> {
    const [postCount] = await Promise.all([
      prisma.post.count({
        where: {
          userId: id
        }
      })
    ]);

    return {
      postCount
    };
  }

  async getProjectStatistics(projectId: string): Promise<ProjectStatistics> {
    const project = await projectService.getProject(projectId);
    const projectFileSize = {
      total:
        PLANS_PROJECT_SPACE_SIZI[project?.plan as keyof typeof PLANS_PROJECT_SPACE_SIZI] ||
        PLANS_PROJECT_SPACE_SIZI.Free,
      used: await fileService.sumFilesizeOfProject(projectId)
    };

    return {
      project: project!,
      projectFileSize
    };
  }
}

export const statsHelper = new StatsHelper();
