// makes the K keys within the T object required, leaves the rest as-is
export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

// makes the K keys within the T object optional, leaves the rest as-is
export type PartialKeys<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

// makes the K keys within the T object required, the others optional
export type RequiredKeysOnly<T, K extends keyof T> = RequiredKeys<
  Partial<T>,
  K
>;

// using ExplicitAny instead of unknown so that also interface types would be compatible
export type PlainObject = Record<string, ExplicitAny>;
