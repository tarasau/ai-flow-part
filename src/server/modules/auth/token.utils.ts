import { getConfig } from '@server/config.ts';
import {
  ACCESS_TOKEN_LIFETIME,
  ACCESS_TOKEN_SECRET,
  JWTPayload,
  REFRESH_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET,
} from '@server/modules/auth/token.types.ts';

const jwt = await (async () => {
  if (getConfig().env === 'prod') {
    return import('@tsndr/cloudflare-worker-jwt');
  } else {
    return import('jsonwebtoken');
  }
})();

export const generateTokens = async (user: JWTPayload) => {
  const timestamp = Date.now();
  const tokenExp = Math.floor(timestamp / 1000) + ACCESS_TOKEN_LIFETIME;
  const refreshTokenExp = Math.floor(timestamp / 1000) + REFRESH_TOKEN_LIFETIME;

  const token = await jwt.sign(
    {
      userId: user.userId,
      exp: tokenExp,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    ACCESS_TOKEN_SECRET,
  );

  const refreshToken = await jwt.sign(
    {
      userId: user.userId,
      exp: refreshTokenExp,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    REFRESH_TOKEN_SECRET,
  );

  return {
    access_token: token,
    refresh_token: refreshToken,
    expires_in: ACCESS_TOKEN_LIFETIME,
    token_type: 'Bearer',
  };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
