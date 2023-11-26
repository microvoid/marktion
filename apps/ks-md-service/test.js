import axios from 'axios'

axios(`${origin}/single?token=${token}`, {
  method: 'POST',
}).then(response => {
  return response;
});

// const path = require('path');
// const kcdnUpload = require('@kcdn/multi-upload/service.js');

// kcdnUpload.uploadMultiple({
//   pid: 'DOCS-HOME', // [必填] 项目pid
//   token: '897_08657acb434dc9395a8436b4a54db563',
//   dir: 'docs-lab-static/ks-md/upload-image',
//   files: [path.join(__dirname, 'package.json')], // [必填] 本地文件路径数组。不支持传入文件夹
// }).then(response => {
//   /**
//     * response: { code: 0, data: { success: true, fileResults: [ { status: 1, cdnUrl: 'https://xxxx' }, ... ] } }
//     * 上传成功示例: { code: 0, data: { success: true, fileResults: [ { status: 1, cdnUrl: 'https://cdnfile.corp.kuaishou.com/kc/files/a/test-dzr002/dev001.txt' } ] } }
//     * 上传失败示例: { code: 3000, msg: "上传失败" }
//     */
//   console.log(JSON.stringify(response));
// });