import { AuthHelper } from '@/libs';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { cookies, headers } from 'next/headers';
import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const authRequest = AuthHelper.luciaAuth.lucia.handleRequest(request.method, {
    headers,
    cookies
  });

  const session = await authRequest.validate();

  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  }

  const cookieStore = cookies();
  const storedState = cookieStore.get('github_oauth_state')?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const session = await AuthHelper.luciaAuth.loginWithGithub(code);

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  } catch (e) {
    console.error(e);

    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }

    return new Response(null, {
      status: 500
    });
  }
};
