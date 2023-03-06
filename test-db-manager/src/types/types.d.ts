type UUID = string;

type LocalizedString = {
  fi_FI?: string;
  sv_FI?: string;
};

// convert from snakecase to camelcase
type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>;
type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};

// convert from camelcase to snakecase
type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;
type KeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
};

// makes the K keys within the T object required, leaves the rest as-is
type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

// makes the K keys within the T object required, the others optional
type RequiredKeysOnly<T, K extends keyof T> = RequiredKeys<Partial<T>, K>;

// using ExplicitAny instead of unknown so that also interface types would be compatible
type PlainObject = Record<string, ExplicitAny>;
