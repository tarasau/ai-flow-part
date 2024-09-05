import { users } from '@server/db/schema.ts';
import { z } from 'zod';

export type JWTPayload = {
  userId: number;
  email: string;
  role: typeof users.$inferSelect.role;
  status: typeof users.$inferSelect.status;
};

export const ACCESS_TOKEN_LIFETIME = 3600;
export const REFRESH_TOKEN_LIFETIME = 5184000;
export const ACCESS_TOKEN_SECRET = 'jn2ds45#lkms1ad!';
export const REFRESH_TOKEN_SECRET = 'jn2ds45#lkms1ad?';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const authTokenSchema = z.object({
  refresh_token: z.string(),
});
