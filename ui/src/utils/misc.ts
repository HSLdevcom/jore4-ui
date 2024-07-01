export function notNullish<T>(
  value: T | null | undefined,
): value is Exclude<T, 'null' | 'undefined'> {
  return value !== null && value !== undefined;
}
