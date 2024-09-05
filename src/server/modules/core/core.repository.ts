import { db } from '@server/db';
import {
  aiProviders,
  anthropicCredentials,
  flows,
  geminiCredentials,
  groqCredentials,
  models,
  openAiCredentials,
} from '@server/db/schema';
import { AiProviders, ProvidersType } from '@server/modules/ai-provider/ai-provider.types.ts';
import { CreateCoreInfoDto } from '@server/modules/core/core.types.ts';
import { getFlowByUserId } from '@server/modules/flow/flow.repository.ts';
import { getModelByUserId } from '@server/modules/model/model.repository.ts';
import { getAiProvidersByUserId } from '@server/modules/ai-provider/ai-provider.repository.ts';
import { eq } from 'drizzle-orm';
import { Flow } from '@shared/modules/flow/types/flow.types';

export const getAllByUserId = async (userId: number) => {
  const [flow, model, aiProvider] = await Promise.all([
    getFlowByUserId(userId),
    getModelByUserId(userId),
    getAiProvidersByUserId(userId),
  ]);
  return {
    flow: flow as Array<(typeof flow)[0] & { schema: Flow }>,
    model: model,
    aiProvider: aiProvider as unknown as (AiProviders & { createdAt: string; id: number })[],
  };
};

export const createAll = async (userId: number, coreInfo: CreateCoreInfoDto) => {
  const [flow, model] = await Promise.all([
    db
      .insert(flows)
      .values({
        name: coreInfo.flow.name,
        schema: coreInfo.flow.schema,
        userId: userId,
      })
      .returning(),
    db
      .insert(models)
      .values({
        name: coreInfo.model.name,
        schema: coreInfo.model.schema,
        userId: userId,
      })
      .returning(),
  ]);
  let dbAiProvider;
  switch (coreInfo.aiProvider.type) {
    case ProvidersType.OpenAI:
      const [openAi] = await db
        .insert(openAiCredentials)
        .values(coreInfo.aiProvider.provider)
        .returning();
      dbAiProvider = await db
        .insert(aiProviders)
        .values({
          name: coreInfo.aiProvider.name,
          type: coreInfo.aiProvider.type,
          userId: userId,
          openAiId: openAi.id,
        })
        .returning();
      break;
    case ProvidersType.Groq:
      const [groq] = await db
        .insert(groqCredentials)
        .values(coreInfo.aiProvider.provider)
        .returning();
      dbAiProvider = await db
        .insert(aiProviders)
        .values({
          name: coreInfo.aiProvider.name,
          type: coreInfo.aiProvider.type,
          userId: userId,
          groqId: groq.id,
        })
        .returning();
      break;
    case ProvidersType.Anthropic:
      const [anthropic] = await db
        .insert(anthropicCredentials)
        .values(coreInfo.aiProvider.provider)
        .returning();
      dbAiProvider = await db
        .insert(aiProviders)
        .values({
          name: coreInfo.aiProvider.name,
          type: coreInfo.aiProvider.type,
          userId: userId,
          anthropicId: anthropic.id,
        })
        .returning();
      break;
    case ProvidersType.Gemini:
      const [gemini] = await db
        .insert(geminiCredentials)
        .values(coreInfo.aiProvider.provider)
        .returning();
      dbAiProvider = await db
        .insert(aiProviders)
        .values({
          name: coreInfo.aiProvider.name,
          type: coreInfo.aiProvider.type,
          userId: userId,
          geminiId: gemini.id,
        })
        .returning();
      break;
  }
  return { flow: flow, model: model, aiProvider: dbAiProvider };
};

export const deleteAllByUserId = async (userId: number) => {
  await Promise.all([
    db.delete(flows).where(eq(flows.userId, userId)),
    db.delete(models).where(eq(models.userId, userId)),
    db.delete(aiProviders).where(eq(aiProviders.userId, userId)),
  ]);
};
