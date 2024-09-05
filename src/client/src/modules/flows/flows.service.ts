import { createMutation, createQuery } from '@tanstack/solid-query';
import { apiClient } from '@infrastructure/api-client';

export const getFlow = () =>
  createQuery(() => ({
    queryKey: ['flow'],
    queryFn: async () => {
      const res = await apiClient.flow.$get();

      if (res.status !== 200) {
        throw new Error('Error while getting flow');
      }

      return await res.json();
    },
    staleTime: 1000 * 60 * 30,
  }));

export const getPlugins = () =>
  createQuery(() => ({
    queryKey: ['plugin'],
    queryFn: async () => {
      const res = await apiClient.flow.plugins.$get();

      if (res.status !== 200) {
        throw new Error('Error while getting flow');
      }

      return await res.json();
    },
    staleTime: 1000 * 60 * 30,
  }));

export const postFlow = () =>
  createMutation(() => ({
    mutationFn: async () => {
      const res = await apiClient.flow.$post({ json: { name: 'test' } });

      if (res.status !== 200) {
        throw new Error('Error while getting flow');
      }

      return await res.json();
    },
  }));
