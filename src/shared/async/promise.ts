export type PromiseUnwrapped<T = unknown, E = Error> = {
  resolve: (value: PromiseLike<T> | T) => void;
  reject: (reason?: E) => void;
  promise: Promise<T>;
};

export const getPromiseWithResolvers = <
  T = unknown,
  E = Error,
>(): PromiseUnwrapped<T, E> => {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: E) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { promise, resolve, reject };
};
