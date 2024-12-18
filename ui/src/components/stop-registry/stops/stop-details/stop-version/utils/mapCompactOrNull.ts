import compact from 'lodash/compact';

/**
 * Map effed up Timat output type to valid input
 *
 * - Filter out nulls from OutputType/input arrays.
 * - Map remaining defined objects
 * - Filter out any potential nulls produced by mapper
 * - Finally if resulting InputType/output array is empty,
 *   return null instead.
 *
 * @param array Input array of OutputType T entities
 * @param mapper Mapper function OutputType T to InputType R
 */
export function mapCompactOrNull<T, R>(
  array: ReadonlyArray<T | null | undefined> | null | undefined,
  mapper: (item: T) => R | null,
): Array<R> | null {
  if (!array) {
    return null;
  }

  const compactedInput = compact(array);
  const mapped = compactedInput.map(mapper);
  const compactedOutput = compact(mapped);

  return compactedOutput.length ? compactedOutput : null;
}
