import { File } from '@prisma/client';
import { uploadR2 } from '@/libs';
import { prisma } from '@/libs';

class FileService {
  async createFile(
    buffer: Buffer,
    options: Pick<File, 'filename' | 'size' | 'userId' | 'projectId'>
  ) {
    const url = await this.upload(options.filename, buffer);
    const file = await prisma.file.create({
      data: {
        ...options,
        url
      }
    });

    return file;
  }

  async sumFilesizeOfProject(projectId: string) {
    const files = await prisma.file.findMany({
      where: {
        projectId: projectId
      }
    });

    const count = files.reduce((count, file) => {
      return count + file.size;
    }, 0);

    return count;
  }

  private async upload(filename: string, buffer: Buffer) {
    const url = await uploadR2(filename, buffer);
    return url;
  }
}

export const fileService = new FileService();
