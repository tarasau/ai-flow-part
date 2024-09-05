import { flowCreateSchema } from '@server/modules/flow/flow.types.ts';
import { z } from 'zod';
import { modelCreateSchema } from '@server/modules/model/model.types.ts';
import { aiProviderCreateSchema } from '@server/modules/ai-provider/ai-provider.types.ts';

export const pathProviderIdSchema = z.object({
  providerId: z.coerce.number(),
});

export const coreCreateSchema = z.object({
  flow: flowCreateSchema,
  model: modelCreateSchema,
  aiProvider: aiProviderCreateSchema,
});

export const coreUpdateSchema = coreCreateSchema.deepPartial()

export type CreateCoreInfoDto = z.infer<typeof coreCreateSchema>;
