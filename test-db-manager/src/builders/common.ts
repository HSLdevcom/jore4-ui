import isNumber from 'lodash/isNumber';
import range from 'lodash/range';
import { randomInt } from '../utils';

export function buildLabelArray(labelPrefix: string, labelCount: number) {
  return range(1, labelCount + 1).map((no) => `${labelPrefix}${no}`);
}

export function buildRandomDuration(
  min: Temporal.Duration,
  max: Temporal.Duration,
) {
  const milliseconds = randomInt(
    min.total({ unit: 'milliseconds' }),
    max.total({ unit: 'milliseconds' }),
  );

  // We only want to handle durations in minute precision, currently.
  return Temporal.Duration.from({ milliseconds }).round({
    largestUnit: 'hours',
    smallestUnit: 'minutes',
    roundingMode: 'trunc',
  });
}

type ConstantCount = number;
type RandomCount = { min: number; max: number };
export type Count = ConstantCount | RandomCount;

export function buildCount(count: Count) {
  return isNumber(count) ? count : randomInt(count.min, count.max);
}

export type ArrayItemPickMethod = 'modulo' | 'random';
/**
 * Picks an item from an array, using the given method. Useful for e.g. generating a reasonable set of journey patterns in a block
 * - 'modulo' method: if the array's length is 3, it'll return the items in the following order: 0, 1, 2, 0, 1, 2, 0, 1, ...
 * - 'random' method: picks a random item from the array
 * - ... other methods might be implemented later as seen fit
 */
export function pickArrayItem<T extends ExplicitAny>(
  method: ArrayItemPickMethod,
  array: T[],
  index: number,
): T {
  if (method === 'modulo') {
    return array[index % array.length];
  }

  if (method === 'random') {
    return array[randomInt(0, array.length - 1)];
  }

  throw new Error(`Unknown array picker method: ${method}`);
}
