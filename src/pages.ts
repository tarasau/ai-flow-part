import { app } from './server/app';

app.get('*', async (ctx) => {
  // @ts-ignore
  return await ctx.env.ASSETS.fetch(ctx.req.raw);
});

export default app;
