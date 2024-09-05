import { apiClient } from '@infrastructure/api-client';
import { createMutation, createQuery } from '@tanstack/solid-query';
import { SignInFormData } from './sign-in/sign-in.types';

export const signUp = () =>
  createMutation(() => ({
    mutationKey: ['signUp'],
    onError: (err) => console.log('err', err),
    mutationFn: async (email: string) => {
      const res = await apiClient.wishlist.create.$post({
        json: { email },
      });

      if (res.status !== 200) {
        throw new Error('Error while adding to waitlist');
      }

      return await res.json();
    },
  }));

export const signIn = () =>
  createMutation(() => ({
    mutationKey: ['signIn'],
    onError: (err) => console.log('err', err),
    mutationFn: async ({ email, password }: SignInFormData) => {
      const res = await apiClient.auth['sign-in'].$post({
        json: { email, password },
      });

      if (res.status !== 200) {
        throw new Error('Error while Sign In');
      }

      return await res.json();
    },
  }));

export const getAll = () =>
  createQuery(() => ({
    queryKey: ['getAll'],
    queryFn: async () => {
      const res = await apiClient.core.getAll.$get();

      if (res.status !== 200) {
        throw new Error('Error while getting user info');
      }

      return await res.json();
    },
    staleTime: 1000 * 60 * 30,
  }));
