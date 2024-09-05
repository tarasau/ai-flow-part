import { db } from '@server/db';
import { aiProviders } from '@server/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  CreateAiProviderDto,
  ProvidersType,
} from '@server/modules/ai-provider/ai-provider.types.ts';
import { createOpenAi } from '@server/modules/ai-provider/openAi/openai.service.ts';
import { createGroq } from '@server/modules/ai-provider/groq/groq.service.ts';
import { createAnthropic } from '@server/modules/ai-provider/anthropic/anthropic.service.ts';
import {createGemini} from "@server/modules/ai-provider/gemini/gemini.service.ts";

export const getAiProvidersByUserId = async (userId: number) => {
  return db.query.aiProviders.findMany({
    columns: {
      openAiId: false,
      groqId: false,
      anthropicId: false,
      geminiId: false,
    },
    where: (aiProviders, { eq }) => eq(aiProviders.userId, userId),
    with: {
      openAiCredential: true,
      groqCredential: true,
      anthropicCredential: true,
      geminiCredentials: true,
    },
  });
};

export const createAiProviders = async (userId: number, aiProvider: CreateAiProviderDto) => {
  let dbAiProvider;
  switch (aiProvider.type) {
    case ProvidersType.OpenAI:
      await db.transaction(async (tx) => {
        const [openAi] = await createOpenAi(aiProvider.provider);
        dbAiProvider = await tx
          .insert(aiProviders)
          .values({
            name: aiProvider.name,
            type: aiProvider.type,
            userId: userId,
            openAiId: openAi.id,
          })
          .returning();
      });
      break;
    case ProvidersType.Groq:
      await db.transaction(async (tx) => {
        const [groq] = await createGroq(aiProvider.provider);
        dbAiProvider = await tx
          .insert(aiProviders)
          .values({
            name: aiProvider.name,
            type: aiProvider.type,
            userId: userId,
            groqId: groq.id,
          })
          .returning();
      });
      break;
    case ProvidersType.Anthropic:
      await db.transaction(async (tx) => {
        const [anthropic] = await createAnthropic(aiProvider.provider);
        dbAiProvider = await tx
          .insert(aiProviders)
          .values({
            name: aiProvider.name,
            type: aiProvider.type,
            userId: userId,
            anthropicId: anthropic.id,
          })
          .returning();
      });
      break;
    case ProvidersType.Gemini:
      await db.transaction(async (tx) => {
        const [gemini] = await createGemini(aiProvider.provider);
        dbAiProvider = await tx
          .insert(aiProviders)
          .values({
            name: aiProvider.name,
            type: aiProvider.type,
            userId: userId,
            geminiId: gemini.id,
          })
          .returning();
      });
      break;
  }
  return dbAiProvider;
};

export const deleteAiProviders = async (userId: number) => {
  return db.delete(aiProviders).where(eq(aiProviders.userId, userId));
};

export const deleteAiProviderByProviderId = async (userId: number, providerId: number) => {
  return db
    .delete(aiProviders)
    .where(and(eq(aiProviders.userId, userId), eq(aiProviders.id, providerId)));
};
