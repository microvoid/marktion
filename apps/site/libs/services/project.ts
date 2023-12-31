import { prisma } from '@/libs';
import { Project, ProjectUserRole } from '@prisma/client';

class ProjectService {
  getProjectsByUserId(userId: string) {
    return prisma.projectUsers.findMany({
      where: {
        userId: userId
      },
      include: {
        project: true
      }
    });
  }

  async createProject(adminUserId: string, input: Pick<Project, 'name' | 'slug'>) {
    const project = await prisma.project.create({
      data: input
    });

    await prisma.projectUsers.create({
      data: {
        userId: adminUserId,
        role: ProjectUserRole.admin,
        projectId: project.id
      }
    });

    return project;
  }
}

export const projectService = new ProjectService();
