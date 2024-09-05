import { z } from 'zod';

export const wishlistSchema = z.object({
  email: z.string().email(),
});
