import { ProvidersType } from '@server/modules/ai-provider/ai-provider.types';
import { z } from 'zod';

export const providerFormValidator = z
  .object({
    name: z.string(),
    aiProvider: z.nativeEnum(ProvidersType).nullable(),
    apiKey: z.string(),
  })
  .refine((val) => !!val.aiProvider, {
    message: 'ai provider required',
  });
export type ConfirmFormData = z.TypeOf<typeof providerFormValidator>;
