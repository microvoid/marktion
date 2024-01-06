import fetch from 'axios';

import { ModelContextType } from '../context';

export const FileModifier = {
  async uploadFileInProject(
    ctx: ModelContextType,
    options: { file: Blob; filename: string; projectId: string }
  ) {
    const data = new FormData();
    data.set('file', options.file);
    data.set('filename', options.filename);
    data.set('projectId', options.projectId);

    const response = await fetch<{ data: { url: string }; status: number; message: string }>(
      `/api/upload`,
      {
        method: 'POST',
        data
      }
    );

    return response.data;
  }
};
