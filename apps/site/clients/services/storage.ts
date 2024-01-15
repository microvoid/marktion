import { Post } from '@prisma/client';
import localforage from 'localforage';

const storage = localforage.createInstance({
  name: 'marktion-storage',
  description: 'marktion-storage'
});

const enum StorageKey {
  post = 'post',
  localIgnoreBefore = 'localIgnoreBefore'
}

const identify = (key: StorageKey, value?: string) => (value ? `${key}-${value}` : key);

class DefaultStorageService {
  async getPosts() {
    const posts: Post[] = [];

    await storage.iterate<Post, void>((value, key) => {
      if (key.startsWith(StorageKey.post)) {
        posts.push(value);
      }
    });

    return posts;
  }

  async insertPost(post: Post) {
    return storage.setItem(identify(StorageKey.post, post.id), post);
  }

  async deletePost(postId: string) {
    return storage.removeItem(identify(StorageKey.post, postId));
  }
}

const PROJECT_TO_STORAGE = new Map<string, ProjectStorage>();

export class ProjectStorage {
  storage = localforage.createInstance({
    name: `marktion-project-${this.projectId}`,
    description: `marktion-project-${this.projectId}`
  });

  constructor(public projectId: string) {}

  markLocalIgnoreBefore(timestamp: number) {
    return this.storage.setItem(StorageKey.localIgnoreBefore, timestamp);
  }

  getLocalIgnoreBefore() {
    return this.storage.getItem<number>(StorageKey.localIgnoreBefore);
  }

  static create(projectId: string) {
    if (!PROJECT_TO_STORAGE.has(projectId)) {
      PROJECT_TO_STORAGE.set(projectId, new ProjectStorage(projectId));
    }

    return PROJECT_TO_STORAGE.get(projectId)!;
  }
}

export const storageService = new DefaultStorageService();
