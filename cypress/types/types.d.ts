type UUID = string;

// Make given keys of a type required, leave the rest as-is
export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;
