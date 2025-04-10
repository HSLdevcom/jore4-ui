// Make given keys of a type required, leave the rest as-is
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// Make given keys of a type required, leave the rest as-is
export type RequiredNonNullableKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: Exclude<T[P], null | undefined>;
};

// Make given keys of a type optional, leave the rest as-is
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Make given keys of a type not nullable, leave the rest as-is
export type NonNullableKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
