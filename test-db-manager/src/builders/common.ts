import isNumber from 'lodash/isNumber';
import range from 'lodash/range';
import { Duration } from 'luxon';
import { randomInt } from '../utils';

export const buildLabelArray = (labelPrefix: string, labelCount: number) =>
  range(1, labelCount + 1).map((no) => `${labelPrefix}${no}`);

export const buildRandomDuration = (min: Duration, max: Duration) => {
  const unroundedDuration = Duration.fromMillis(
    randomInt(min.toMillis(), max.toMillis()),
  );

  // We only want to handle durations in minute precision, currently.
  const durationParts = unroundedDuration.rescale().toObject();
  delete durationParts.seconds;
  delete durationParts.milliseconds;
  const durationInMinutes = Duration.fromObject(durationParts);

  return durationInMinutes;
};

type ConstantCount = number;
type RandomCount = { min: number; max: number };
export type Count = ConstantCount | RandomCount;

export const buildCount = (count: Count) =>
  isNumber(count) ? count : randomInt(count.min, count.max);

export type ArrayItemPickMethod = 'modulo' | 'random';
/**
 * Picks an item from an array, using the given method. Useful for e.g. generating a reasonable set of journey patterns in a block
 * - 'modulo' method: if the array's length is 3, it'll return the items in the following order: 0, 1, 2, 0, 1, 2, 0, 1, ...
 * - 'random' method: picks a random item from the array
 * - ... other methods might be implemented later as seen fit
 */
export const pickArrayItem = <T extends ExplicitAny>(
  method: ArrayItemPickMethod,
  array: T[],
  index: number,
): T => {
  if (method === 'modulo') {
    return array[index % array.length];
  }
  if (method === 'random') {
    return array[randomInt(0, array.length - 1)];
  }
  // compile-time type checking:
  // https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript
  const exhaustiveCheck: never = method;
  throw new Error(`Unknown array picker method: ${exhaustiveCheck}`);
};
