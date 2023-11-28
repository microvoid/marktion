import localforage from 'localforage';
import { nanoid } from 'nanoid';
import type { APIAdapter, User, Article } from '.';

export class LocalAdapter implements APIAdapter {
  async createUser(input: Pick<User, 'avatar' | 'email' | 'username'>): Promise<User> {
    const user = {
      ...input,
      id: 'local-user'
    };

    await localforage.setItem('login-user', user);

    return user;
  }

  async getLoginUser(): Promise<User> {
    const user = (await localforage.getItem('login-user')) as User;

    if (!user) {
      return this.createUser({
        username: 'local-user'
      });
    }

    return user;
  }

  async getArticles(): Promise<Article[]> {
    const articles = (await localforage.getItem('articles')) as Article[];

    return articles || [];
  }

  async delArtcile(id: string) {
    const list = await this.getArticles();

    await localforage.setItem(
      'articles',
      list.filter(item => item.id !== id)
    );
  }

  async upsertArticle(input: Pick<Article, 'content' | 'owner'>, id?: string): Promise<Article> {
    const list = await this.getArticles();
    const loginUser = await this.getLoginUser();
    const finded = id && list.find(item => item.id === id);

    let article: Article;

    if (finded) {
      article = finded;

      article.content = input.content;
      article.owner = input.owner;
      article.updateAt = Date.now();
    } else {
      article = {
        ...input,
        id: nanoid(),
        owner: loginUser,
        createAt: Date.now(),
        updateAt: Date.now()
      };
      list.unshift(article);
    }

    await localforage.setItem('articles', list);

    return article;
  }
}
