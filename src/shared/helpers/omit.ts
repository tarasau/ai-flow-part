export const omit = <T extends object, K extends [...(keyof T)[]]>(
    originalObj: T,
    keysToOmit: K,
): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
} =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.fromEntries(
        Object.entries(originalObj).filter(
            ([key]) => !keysToOmit.includes(key as keyof T),
        ),
    );