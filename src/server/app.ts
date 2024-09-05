import { Hono } from 'hono';
import { flowRouter } from './routes/flow';
import { wishlistRouter } from './modules/wish-list/wishlist.router';
import { authRouter } from './modules/auth/auth.router.ts';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { aiProviderRouter } from '@server/modules/ai-provider/ai-provider.router.ts';
import { coreRouter } from '@server/modules/core/core.router.ts';

const app = new Hono();

app.use('*', logger());
app.use('/api/*', cors());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // TODO: create custom error codes
    return c.json({ errorCode: 1, message: err.message }, { status: err.getResponse().status });
  }

  return c.json({ errorCode: 1, message: 'Something went wrong ' }, { status: 500 });
});

const api = app
  .basePath('/api')
  .route('/wishlist', wishlistRouter)
  .route('/flow', flowRouter)
  .route('/auth', authRouter)
  .route('/aiprovider', aiProviderRouter)
  .route("/core", coreRouter);

export { app, api };
