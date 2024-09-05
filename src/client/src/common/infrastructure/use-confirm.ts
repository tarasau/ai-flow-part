import { getPromiseWithResolvers } from '@shared/async/promise.ts';
import { doNothing } from '../utils/do-nothing';
import { createSignal } from 'solid-js';

export const useConfirm = <T = unknown>() => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [resolver, setResolver] =
    createSignal<(data: { isCancelled: boolean; value?: T | null }) => void>(doNothing);
  const [rejector, setRejector] = createSignal<(reason?: Error) => void>();

  const start = () => {
    const { promise, resolve, reject } =
      getPromiseWithResolvers<Parameters<ReturnType<typeof resolver>>[0]>();

    setResolver(() => resolve);
    setRejector(() => reject);

    setIsOpen(true);

    return promise;
  };

  const confirm = (data?: T) => {
    if (!resolver()) {
      throw new Error('Confirm start has to be called first');
    }

    resolver()({ isCancelled: false, value: data });
    setIsOpen(false);
  };

  const reject = (reason?: Error) => {
    const rejectorValue = rejector();
    if (!rejectorValue) {
      throw new Error('Confirm start has to be called first');
    }

    rejectorValue(reason);
    setIsOpen(false);
  };

  const cancel = () => {
    resolver()({ isCancelled: true, value: null });
    setIsOpen(false);
  };

  return [isOpen, start, confirm, reject, cancel] as const;
};
