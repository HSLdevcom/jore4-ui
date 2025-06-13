export function notNullish<T>(
  value: T | null | undefined,
): value is Exclude<T, 'null' | 'undefined'> {
  return value !== null && value !== undefined;
}

/**
 * Checks if predicate returns false for all element of collection. Iteration is stopped once predicate
 * returns truthy. The predicate is invoked with three arguments: (value, index|key, collection).
 *
 * @param collection The collection to iterate over.
 * @param predicate The function invoked per iteration.
 * @return Returns true if all element failed the predicate check, else false.
 */
export function none<T>(
  predicate: (value: T) => boolean,
  collection: ReadonlyArray<T>,
): boolean;
export function none<T>(
  predicate: (value: T) => boolean,
  collection: Readonly<Record<string, T>>,
): boolean;
export function none<T>(
  predicate: (value: T) => boolean,
  collection: ReadonlyArray<T> | Readonly<Record<string, T>>,
) {
  if (Array.isArray(collection)) {
    return !collection.some(predicate);
  }

  return !Object.values(collection).some(predicate);
}
