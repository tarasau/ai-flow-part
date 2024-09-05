import { hc } from 'hono/client';
import { AsyncMutex } from './async-mutex';
import { refreshToken } from './refresh-token';
import { redirectToLogin } from './redirect-to-login';
import { Api } from '@server/api.types.ts';

const mutex = new AsyncMutex();

type FetchFunction = typeof window.fetch;

const fetchProxy: FetchFunction = new Proxy(window.fetch, {
  apply: async function (
    target: FetchFunction,
    thisArg: any,
    argumentsList: Parameters<FetchFunction>,
  ): Promise<Response> {
    const url = argumentsList[0];

    if (typeof url !== 'string') throw new Error('Unexpected search URL');

    if (url.endsWith('/sign-in')) {
      const result = await target.apply(thisArg, argumentsList);
      return result;
    }

    const release = await mutex.acquire();

    const authTokenExpiration = localStorage.getItem('token_expiration');

    if (!authTokenExpiration) {
      redirectToLogin();
      throw new Error('Unknown token expiration');
    }

    if (parseInt(authTokenExpiration) <= Math.floor(Date.now() / 1000)) {
      await refreshToken();
    }

    const token = localStorage.getItem('access_token') || '';

    if (argumentsList[1]?.headers) {
      argumentsList[1].headers = new Headers(argumentsList[1].headers);
      argumentsList[1].headers.append('Authorization', `Bearer ${token}`);
    }

    release();

    const result = await target.apply(thisArg, argumentsList);

    return result;
  },
});

const client = hc<Api>('/', { fetch: fetchProxy });

export const apiClient = client.api;
