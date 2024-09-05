import { z } from 'zod';
import { anthropicCredentialsSchema } from '@server/modules/ai-provider/anthropic/dto/anthropic.dto.ts';
import { groqCredentialsSchema } from '@server/modules/ai-provider/groq/dto/groq.dto.ts';
import { openAiCredentialsSchema } from '@server/modules/ai-provider/openAi/dto/openai.dto.ts';
import { geminiCredentialsSchema } from '@server/modules/ai-provider/gemini/dto/gemini.dto.ts';

export enum ProvidersType {
  OpenAI = 'OpenAI',
  Groq = 'Groq',
  Gemini = 'Gemini',
  Anthropic = 'Anthropic',
}

export const typeDiscriminatorSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(ProvidersType.OpenAI),
    provider: openAiCredentialsSchema,
  }),
  z.object({
    type: z.literal(ProvidersType.Groq),
    provider: groqCredentialsSchema,
  }),
  z.object({
    type: z.literal(ProvidersType.Anthropic),
    provider: anthropicCredentialsSchema,
  }),
  z.object({
    type: z.literal(ProvidersType.Gemini),
    provider: geminiCredentialsSchema,
  }),
]);

export const aiProviderCreateSchema = z
  .object({
    name: z.string().max(100),
  })
  .and(typeDiscriminatorSchema);

export type CreateAiProviderDto = z.infer<typeof aiProviderCreateSchema>;

export const typeProvidersSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(ProvidersType.OpenAI),
    openAiCredential: openAiCredentialsSchema,
  }),
  z.object({
    type: z.literal(ProvidersType.Groq),
    groqCredential: groqCredentialsSchema,
  }),
  z.object({
    type: z.literal(ProvidersType.Anthropic),
    anthropicCredential: anthropicCredentialsSchema,
  }),
  z.object({
    type: z.literal(ProvidersType.Gemini),
    geminiCredentials: geminiCredentialsSchema,
  }),
]);

export const aiProviderSchema = z
  .object({
    name: z.string().max(100),
  })
  .and(typeProvidersSchema);

export type AiProviders = z.infer<typeof aiProviderSchema>;
