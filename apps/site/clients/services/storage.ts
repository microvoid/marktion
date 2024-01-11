import { Post } from '@prisma/client';
import localforage from 'localforage';

const storage = localforage.createInstance({
  name: 'marktion-storage',
  description: 'marktion-storage'
});

const enum StorageKey {
  post = 'post'
}

const identify = (key: StorageKey, value?: string) => (value ? `${key}-${value}` : key);

class StorageService {
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
}

export const storageService = new StorageService();
