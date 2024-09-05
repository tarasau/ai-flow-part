import {
  createAiProviders,
  deleteAiProviderByProviderId,
  deleteAiProviders,
  getAiProvidersByUserId,
} from '@server/modules/ai-provider/ai-provider.repository.ts';
import { CreateAiProviderDto } from '@server/modules/ai-provider/ai-provider.types.ts';

export const getByUserId = async (userId: number) => {
  return getAiProvidersByUserId(userId);
};

export const create = async (userId: number, aiProvider: CreateAiProviderDto) => {
  return createAiProviders(userId, aiProvider);
};

export const deleteByUserId = async (userId: number) => {
  return deleteAiProviders(userId);
};

export const deleteByProviderId = async (userId: number, providerId: number) => {
  return deleteAiProviderByProviderId(userId, providerId);
};
