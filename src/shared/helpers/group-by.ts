export function groupBy<T, P extends true | false, R>(
    target: T[],
    fieldSelector: (arg0: T) => string | number,
): { [p: string]: T };
export function groupBy<T, P extends true | false, R>(
    target: T[],
    fieldSelector: (arg0: T) => string | number,
    stackDuplicateKeys?: P,
): { [key: string]: P extends true ? T[] : T };
export function groupBy<T, P extends true | false, R>(
    target: T[],
    fieldSelector: (arg0: T) => string | number,
    stackDuplicateKeys?: P,
    valueSelector?: (arg0: T, index: number) => R,
): { [key: string]: P extends true ? R[] : R };
export function groupBy<T, P extends true | false, R>(
    target: T[],
    fieldSelector: (arg0: T) => string | number,
    stackDuplicateKeys?: P,
    valueSelector?: (arg0: T, index: number) => R,
) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stack = (acc, key, value) =>
        !acc[key]
            ? { ...acc, [key]: [value] }
            : { ...acc, [key]: [...acc[key], value] };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const replace = (acc, key, value) => ({
        ...acc,
        [key]: value,
    });
    const insert = stackDuplicateKeys ? stack : replace;

    return target.reduce<{ [key: string]: P extends true ? T[] : T }>(
        (acc, item, index) => insert(acc, fieldSelector(item, ),  valueSelector? valueSelector(item, index) : item),
        {},
    );
}
