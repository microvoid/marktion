import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';
import { github } from '@lucia-auth/oauth/providers';
import { prisma as PrismaAdapter } from '@lucia-auth/adapter-prisma';
import * as context from 'next/headers';
import { prisma } from '@/libs';
import { cache } from 'react';

export type Auth = LuciaAuth['lucia'];

class LuciaAuth {
  public lucia = createLucia();
  public providers = {
    github: createGithubProvider(this.lucia)
  };

  getSession = cache(() => {
    const request = this.lucia.handleRequest('GET', context);
    return request.validate();
  });

  async getSessionUser() {
    const session = await this.getSession();

    return session?.user || null;
  }

  async getGithubAuthUrl() {
    return this.providers.github.getAuthorizationUrl();
  }

  async loginWithGithub(code: string) {
    const { getExistingUser, githubUser, createUser } =
      await this.providers.github.validateCallback(code);

    const getOrCreateUser = async () => {
      const exist = await getExistingUser();

      if (exist) {
        return await this.lucia.updateUserAttributes(exist.id, {
          avatar: githubUser.avatar_url,
          name: githubUser.name!
        });
      }

      const user = await createUser({
        attributes: {
          name: githubUser.login,
          email: githubUser.email || undefined,
          avatar: githubUser.avatar_url,
          anonymous: false
        }
      });

      return user;
    };

    const user = await getOrCreateUser();
    const session = await this.lucia.createSession({
      userId: user.userId,
      attributes: {}
    });

    return session;
  }
}

export const luciaAuth = new LuciaAuth();

function createLucia() {
  return lucia({
    adapter: PrismaAdapter(prisma),
    middleware: nextjs_future(),
    env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    sessionCookie: {
      expires: false
    },
    getUserAttributes: data => {
      return data;
    }
  });
}

function createGithubProvider(auth: Auth) {
  return github(auth, {
    clientId: process.env.GITHUB_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
  });
}
