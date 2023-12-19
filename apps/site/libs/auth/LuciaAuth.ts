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
      return {
        githubUsername: data.username
      };
    }
  });
}

function createGithubProvider(auth: Auth) {
  return github(auth, {
    clientId: process.env.GITHUB_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
  });
}
