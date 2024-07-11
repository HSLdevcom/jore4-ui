export function isNotNullish<T>(
  value: T | undefined | null,
): value is Exclude<T, 'null' | 'undefined'> {
  return value !== null && value !== undefined;
}

export function expectValue<T>(
  value: T | undefined | null,
): Exclude<T, 'null' | 'undefined'> {
  if (isNotNullish(value)) {
    return value;
  }

  throw new Error(
    'Invalid seed data! Expected value to be not null or undefined!',
  );
}
