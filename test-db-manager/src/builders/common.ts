import isNumber from 'lodash/isNumber';
import range from 'lodash/range';
import { Duration } from 'luxon';
import { randomInt } from '../utils';

export const buildLabelArray = (labelPrefix: string, labelCount: number) =>
  range(1, labelCount + 1).map((no) => `${labelPrefix}${no}`);

export const buildRandomDuration = (minMs = 0, maxMs = 60 * 5 * 1000) =>
  Duration.fromMillis(randomInt(minMs, maxMs));

export type ConstantCount = number;
export type RandomCount = { min: number; max: number };
export type Count = ConstantCount | RandomCount;

export const buildCount = (count: Count) =>
  isNumber(count) ? count : randomInt(count.min, count.max);

export type ArrayItemPickMethod = 'modulo' | 'paired';
/**
 * Picks an item from an array, using the given method. Useful for e.g. generating a reasonable set of journey patterns in a block
 * - 'modulo' method: if the array's length is 3, it'll return the items in the following order: 0, 1, 2, 0, 1, 2, 0, 1, ...
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
  throw new Error(`Unknown array picker method: ${method}`);
};
