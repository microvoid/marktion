import { Octokit } from 'octokit';

const dirvier = new Octokit({
  auth: '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'
});

export function get() {
  dirvier.rest.git.getTree({
    owner: 'microvoid',
    repo: 'marktion',
    tree_sha: ''
  });
}

export async function readMdContents(...args: Parameters<Octokit['rest']['repos']['getContent']>) {
  const { data } = await dirvier.rest.repos.getContent(...args);

  if (Array.isArray(data)) {
    return data.filter(item => item.type === 'file' && isMdFile(item.path));
  }

  return [];
}

export async function getRepo() {
  const res = await dirvier.rest.repos.get({
    owner: 'microvoid',
    repo: 'marktion'
  });

  return {
    res,
    contents: await readMdContents({
      owner: 'microvoid',
      repo: 'marktion',
      path: ''
    })
  };
}

const isMdFile = (path: string) => path.endsWith('.md');
