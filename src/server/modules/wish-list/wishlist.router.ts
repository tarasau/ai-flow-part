import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@server/db';
import { leads, users } from '@server/db/schema';
import { authGuard } from '@server/modules/auth/auth.guard.ts';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { wishlistSchema } from '@server/modules/wish-list/wishlist.types.ts';

const wishlistRouter = new Hono()
  .get('/', (c) => {
    return c.json([{ uid: 'wqeqe', name: 'Test' }]);
  })
  .get('/test', async (c) => {
    return c.json(await db.select().from(users));
  })
  .post('/create', zValidator('json', wishlistSchema), async (c) => {
    const { email } = c.req.valid('json');

    await db.insert(leads).values({ email }).onConflictDoNothing({ target: leads.email });

    return c.json({ message: 'Email saved successfully' });
  })
  .post('/accept', zValidator('json', wishlistSchema), authGuard(['ADMIN']), async (c) => {
    const { email } = c.req.valid('json');

    const lead = await db.query.leads.findFirst({
      where: eq(leads.email, email),
    });

    if (!lead) {
      throw new HTTPException(404, { message: 'Lead not found' });
    }

    // Generating random password, not secure, but for first time login should be ok, needs to be sent via email to accepted user
    const randomPassword = Math.random().toString(36).slice(-8);
    const salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(randomPassword, salt, 10000, 64, 'sha512')
      .toString('hex');

    await db.transaction(async (tx) => {
      await tx.insert(users).values({ email, password: hashedPassword, salt });

      await tx.delete(leads).where(eq(leads.email, email));
    });

    return c.json({ message: 'User accepted successfully' });
  });

export { wishlistRouter };
