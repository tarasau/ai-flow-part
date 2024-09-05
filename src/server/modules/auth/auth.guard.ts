import { Context, Next } from 'hono';
import { users } from '@server/db/schema.ts';
import { HTTPException } from 'hono/http-exception';
import { getConfig } from '@server/config.ts';
import { ACCESS_TOKEN_SECRET, JWTPayload } from '@server/modules/auth/token.types.ts';

const jwt = await (async () => {
  if (getConfig().env === 'prod') {
    return import('@tsndr/cloudflare-worker-jwt');
  } else {
    return import('jsonwebtoken');
  }
})();

export const authGuard = (allowedRoles: (typeof users.$inferSelect.role)[]) => {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = (await jwt.verify(token, ACCESS_TOKEN_SECRET)) as JWTPayload;

      if (!allowedRoles.includes(decoded.role)) {
        return c.json('Forbidden', 403);
      }

      c.set('userId', decoded.userId);
      c.set('email', decoded.email);
      c.set('role', decoded.role);
      c.set('status', decoded.status);

      await next();
    } catch (err) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
  };
};
