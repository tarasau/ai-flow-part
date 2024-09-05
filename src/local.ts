import { app } from './server/app';

Bun.serve({
  port: 3000,
  fetch: app.fetch,
});
