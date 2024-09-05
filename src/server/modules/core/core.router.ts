import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { coreCreateSchema } from '@server/modules/core/core.types.ts';
import {
  createAllInfo,
  deleteAllInfo,
  getAll,
  updateAllInfo,
} from '@server/modules/core/core.service.ts';
import { authGuard } from '@server/modules/auth/auth.guard.ts';
import { JWTPayload } from '../auth/token.types';

export const coreRouter = new Hono<{ Variables: JWTPayload }>()
  .get('/getAll', authGuard(['USER']), async (c) => {
    const userId = c.get('userId');
    return c.json(await getAll(userId));
  })
  .post('/createAll', authGuard(['USER']), zValidator('json', coreCreateSchema), async (c) => {
    const userId = c.get('userId');
    const data = c.req.valid('json');
    return c.json(await createAllInfo(data, userId));
  })
  .put('/updateAll', authGuard(['USER']), zValidator('json', coreCreateSchema), async (c) => {
    const userId = c.get('userId');
    const data = c.req.valid('json');
    return c.json(await updateAllInfo(data, userId));
  })
  .delete('/deleteAll', authGuard(['USER']), async (c) => {
    const userId = c.get('userId');
    await deleteAllInfo(userId);
    return c.json({ success: true });
  });
