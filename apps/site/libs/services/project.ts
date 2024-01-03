import { PLANS_AI_LIMIT, PLANS_PROJECT_SPACE_SIZI, prisma } from '@/libs';
import {
  Prisma,
  Project,
  ProjectPlan,
  ProjectPlanItem,
  ProjectPlanPayMethod,
  ProjectUserRole
} from '@prisma/client';

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

  async getProject(projectId: string) {
    return prisma.project.findUnique({
      where: {
        id: projectId
      }
    });
  }

  async upgradeProjectToPro(projectId: string) {
    return prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        plan: ProjectPlanItem.Pro,
        sizeLimit: PLANS_PROJECT_SPACE_SIZI.Pro,
        aiChatLimit: PLANS_AI_LIMIT.Pro
      }
    });
  }

  async downgradeProjectToFree(projectId: string) {
    return prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        plan: ProjectPlanItem.Free,
        sizeLimit: PLANS_PROJECT_SPACE_SIZI.Free,
        aiChatLimit: PLANS_AI_LIMIT.Free
      }
    });
  }

  async createProjectPlan(data: Prisma.ProjectPlanCreateArgs['data']) {
    return prisma.projectPlan.create({
      data: data
    });
  }

  async getProjectPlanByCDKey(cdkey: string) {
    return prisma.projectPlan.findUnique({
      where: {
        cdkey
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
