import { Project } from '@prisma/client';

export type UserStatistics = {
  postCount: number;
};

export type ProjectStatistics = {
  project: Project;
  projectFileSize: {
    total: number;
    used: number;
  };
};
