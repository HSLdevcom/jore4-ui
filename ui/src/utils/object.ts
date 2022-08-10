export type PlainObject = Record<string, unknown>;

export const isPlainObject = (input: unknown): input is PlainObject => {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
};

// the built-in Object.keys() method returns only a limited string[] type.
// The actual return type should be KeyOf<T>[]
export const getObjectKeys = <T extends PlainObject>(input: T) => {
  return Object.keys(input) as KeyOf<T>[];
};
