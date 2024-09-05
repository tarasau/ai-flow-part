import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { aiProviderCreateSchema } from '@server/modules/ai-provider/ai-provider.types.ts';
import { create, deleteByProviderId } from '@server/modules/ai-provider/ai-provider.service.ts';
import { authGuard } from '@server/modules/auth/auth.guard.ts';
import { pathProviderIdSchema } from '@server/modules/core/core.types.ts';
import { JWTPayload } from '../auth/token.types';

export const aiProviderRouter = new Hono<{ Variables: JWTPayload }>()
  .post('/create', authGuard(['USER']), zValidator('json', aiProviderCreateSchema), async (c) => {
    const data = c.req.valid('json');
    const userId = c.get('userId');
    const aiProvider = await create(userId, data);
    return c.json(aiProvider);
  })
  .delete(
    '/:providerId',
    authGuard(['USER']),
    zValidator('param', pathProviderIdSchema),
    async (c) => {
      const providerId = parseInt(c.req.param('providerId'));
      const userId = c.get('userId');
      await deleteByProviderId(userId, providerId);
      return c.json({ success: true });
    },
  );
