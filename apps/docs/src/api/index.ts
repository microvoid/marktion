import { LocalAdapter } from './local';

export type Article = {
  id: string;
  content: string;
  owner: User;
  createAt: number;
  updateAt: number;

  pv?: number;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
};

export interface APIAdapter {
  createUser(input: Pick<User, 'avatar' | 'email' | 'username'>): Promise<User>;
  getLoginUser(): Promise<User>;

  delArtcile(articleId: string): Promise<void>;
  getArticles(userId: string): Promise<Article[]>;
  upsertArticle(options: Pick<Article, 'content' | 'owner'>): Promise<Article>;
}

export const api = new LocalAdapter();
