export const asyncQueue = <T, P extends true | false>(
  jobs: Array<(input?: T) => Promise<T>>,
  input?: T,
  settled?: P,
): Promise<Array<P extends true ? PromiseSettledResult<T> : T>> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Promise[settled ? 'allSettled' : 'all'](
    jobs.reduce<Array<Promise<T>>>(
      (acc, next, i) => [
        ...acc,
        !i ? jobs[i](input) : acc[i - 1].then((r) => next(r)),
      ],
      [],
    ),
  );
};
