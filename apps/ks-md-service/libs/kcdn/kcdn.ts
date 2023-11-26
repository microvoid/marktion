import axios from 'axios';

export type CDNResponse = {
  code: number;
  data: {
    success: boolean;
    fileResults: FileResult[];
  };
  msg: string;
};

type FileResult = {
  status: number;
  cdnUrl: string;
};

const token = '897_08657acb434dc9395a8436b4a54db563';
const origin = 'https://kcdn-plugin.corp.kuaishou.com/api/kcdn/v1/service/npmUpload';

export async function upload(files: File[]): Promise<CDNResponse> {
  const formData = new FormData();

  formData.append('pid', 'DOCS-HOME');
  formData.append('timeout', '2000');

  files.map(file => {
    formData.append('files[]', file);
  });

  formData.append('dir', 'docs-lab-static/ks-md/upload-image');
  formData.append('uid', 'ks-md');
  formData.append('allowRewrite', 'false');
  formData.append('allowHash', 'false');

  const response = await axios(`${origin}/multiple?token=${token}`, {
    method: 'POST',
    data: formData
  });

  return response.data;
}
