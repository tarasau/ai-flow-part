import * as crypto from 'node:crypto';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@server/db';
import { users } from '@server/db/schema';
import { generateTokens, verifyToken } from '@server/modules/auth/token.utils.ts';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { authGuard } from '@server/modules/auth/auth.guard.ts';
import { authSchema, authTokenSchema, JWTPayload } from '@server/modules/auth/token.types.ts';

const authRouter = new Hono<{ Variables: JWTPayload }>()
  .get('/current-user', authGuard(['USER']), async (c) => {
    return c.json(
      await db.query.users.findFirst({
        where: eq(users.id, c.get('userId')),
        columns: {
          email: true,
          id: true,
          role: true,
          status: true,
        },
      }),
    );
  })
  .post('/sign-up', zValidator('json', authSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    const salt = crypto.randomBytes(32).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    let tokens;

    // TODO: catch error (unique constraint)
    await db.transaction(async (tx) => {
      const newUser = await tx
        .insert(users)
        .values({ email, password: hashedPassword, salt })
        .returning();

      tokens = await generateTokens({
        userId: newUser[0].id,
        email: newUser[0].email,
        role: newUser[0].role,
        status: newUser[0].status,
      });

      await tx
        .update(users)
        .set({ refreshToken: tokens.refresh_token })
        .where(eq(users.email, email));
    });

    return c.json(tokens);
  })
  .post('/sign-in', zValidator('json', authSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new HTTPException(400, { message: 'Wrong email and/or password' });
    }

    const checkHash = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex');

    if (checkHash !== user.password) {
      throw new HTTPException(400, { message: 'Wrong email and/or password' });
    }

    const tokens = await generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    await db
      .update(users)
      .set({ refreshToken: tokens.refresh_token })
      .where(eq(users.email, user.email));

    return c.json(tokens);
  })
  .post('/token', zValidator('json', authTokenSchema), async (c) => {
    const { refresh_token } = c.req.valid('json');

    let decodedToken: JWTPayload;

    try {
      decodedToken = (await verifyToken(refresh_token)) as JWTPayload;
    } catch {
      throw new HTTPException(401, { message: 'Invalid refresh token' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, decodedToken.email),
    });

    if (!user) {
      throw new HTTPException(401, { message: "User doesn't exist" });
    }

    if (!user.refreshToken) {
      throw new HTTPException(401, { message: 'Refresh token not found' });
    }

    if (user.refreshToken !== refresh_token) {
      throw new HTTPException(401, { message: 'Refresh tokens do not match' });
    }

    const tokens = await generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    await db
      .update(users)
      .set({ refreshToken: tokens.refresh_token })
      .where(eq(users.email, user.email));

    return c.json(tokens);
  });

export { authRouter };
