import { z } from 'zod';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@server/db';
import { users } from '@server/db/schema';
import comparison from '../plugins/comparison/index.ts';
import { getConfig } from '@server/config.ts';

const flowSchema = z.object({
  name: z.string().max(40),
});

const flowRouter = new Hono()
  .get('/', (c) => {
    return c.json([{ uid: 'wqeqe', name: 'Test' }]);
  })
  .get('/test', async (c) => {
    return c.json(await db.select().from(users));
  })
  .get('/plugins', async (c) => {
    if (getConfig().env === 'prod') {
      return c.json([
        {
          id: 'custom-node',
          ...comparison,
        },
      ]);
    }

    const path = await import('node:path');

    const executorFile = Bun.file(
      path.resolve(__dirname, '../plugins/comparison/comparison.executor.js'),
    );
    const htmlFile = Bun.file(
      path.resolve(__dirname, '../plugins/comparison/comparison.node.html'),
    );
    const cssFile = Bun.file(path.resolve(__dirname, '../plugins/comparison/comparison.node.css'));
    const jsFile = Bun.file(path.resolve(__dirname, '../plugins/comparison/comparison.node.js'));

    const [executor, html, css, js] = await Promise.all([
      executorFile.text(),
      htmlFile.text(),
      cssFile.text(),
      jsFile.text(),
    ]);

    return c.json([
      {
        id: 'custom-node',
        executor,
        html,
        css,
        js,
      },
    ]);
  })
  .post('/', zValidator('json', flowSchema), (c) => {
    const data = c.req.valid('json');

    return c.json({ uid: 'wqeqe', data });
  });

export { flowRouter };
