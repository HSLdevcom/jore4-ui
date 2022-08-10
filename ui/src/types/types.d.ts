// Trick for preventing linter warnings in places where any is needed as type
type ExplicitAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any

type UUID = string;

type LocalizedString = {
  // eslint-disable-next-line camelcase
  fi_FI?: string;
  // eslint-disable-next-line camelcase
  sv_FI?: string;
};

// based on https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object/58436959#58436959

type Cons<H, T> = T extends readonly ExplicitAny[]
  ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
    ? R
    : never
  : never;

// decrement numeric type value (used for recursion limit)
// prettier-ignore
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

// join string paths
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

// paths strings within a object
type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object // eslint-disable-line @typescript-eslint/ban-types
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';

// by default keyof T can be string | number | symbol
// but most times we know that the keys can only be strings
type StringKeyOf<T> = Extract<keyof T, string>;
type ValueOf<T> = T[keyof T];
