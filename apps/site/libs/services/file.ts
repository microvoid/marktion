import { File } from '@prisma/client';
import { uploadR2 } from '@/libs';
import { prisma } from '@/libs';

export class FileService {
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

  private async upload(filename: string, buffer: Buffer) {
    const url = await uploadR2(filename, buffer);
    return url;
  }
}
