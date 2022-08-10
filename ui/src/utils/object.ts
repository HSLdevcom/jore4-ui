export type PlainObject = Record<string, unknown>;

export const isPlainObject = (input: unknown): input is PlainObject => {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
};
