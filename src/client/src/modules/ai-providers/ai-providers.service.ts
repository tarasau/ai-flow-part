import { apiClient } from '@infrastructure/api-client';
import { CreateAiProviderDto } from '@server/modules/ai-provider/ai-provider.types';
import { createMutation } from '@tanstack/solid-query';

export const addNewProviderCreator = () =>
  createMutation(() => ({
    mutationKey: ['addNewProvider'],
    onError: (err) => console.log('err', err),
    mutationFn: async (data: CreateAiProviderDto) => {
      const res = await apiClient.aiprovider.create.$post({
        json: data,
      });

      if (res.status !== 200) {
        throw new Error('Error while adding to waitlist');
      }

      return await res.json();
    },
  }));

export const deleteProviderCreator = () =>
  createMutation(() => ({
    mutationKey: ['deleteProvider'],
    onError: (err) => console.log('err', err),
    mutationFn: async (id: number) => {
      const res = await apiClient.aiprovider[':providerId'].$delete({
        param: { providerId: id.toString() },
      });

      if (res.status !== 200) {
        throw new Error('Error while adding to waitlist');
      }

      return await res.json();
    },
  }));
