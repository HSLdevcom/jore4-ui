// Make given keys of a type required, leave the rest as-is
export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

// Make given keys of a type optional, leave the rest as-is
export type OptionalKeys<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

// Make given keys of a type not nullable, leave the rest as-is
export type NonNullableKeys<T, K extends keyof T> = {
  [P in K]: NonNullable<T[P]>;
} & Omit<T, K>;
