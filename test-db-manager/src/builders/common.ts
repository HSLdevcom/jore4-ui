import flow from 'lodash/flow';
import range from 'lodash/range';
import { Duration } from 'luxon';
import { TimetabledPassingTimeInsertInput } from '../types';
import { randomInt } from '../utils/random';

export const buildLabelArray = (labelPrefix: string, labelCount: number) =>
  range(1, labelCount + 1).map((no) => `${labelPrefix}${no}`);

export const buildRegularTimeSequence = (
  startTime: Duration,
  intervalMs: number,
  count: number,
) => {
  let current: Duration = startTime;
  const timeSequence: Duration[] = [current];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < count; i++) {
    current = Duration.fromMillis(current.toMillis() + intervalMs);
    timeSequence.push(current);
  }
  return timeSequence;
};

export const buildRandomTimeSequence = (
  startTime: Duration,
  count: number,
  minTraversalTimeMs = 0,
  maxTraversalTimeMs = 60 * 5 * 1000,
) => {
  let current: Duration = startTime;
  const timeSequence: Duration[] = [current];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < count; i++) {
    const intervalMs = randomInt(minTraversalTimeMs, maxTraversalTimeMs);
    current = Duration.fromMillis(current.toMillis() + intervalMs);
    timeSequence.push(current);
  }
  return timeSequence;
};

export type PassingTime = Required<
  Pick<TimetabledPassingTimeInsertInput, 'arrival_time' | 'departure_time'>
>;

export const buildPassingTimeSequence = (
  timeSequence: Duration[],
): PassingTime[] => {
  const passingTimeSequence = timeSequence.map((time) => ({
    arrival_time: time,
    departure_time: time,
  }));

  passingTimeSequence[0].arrival_time = null;
  passingTimeSequence[passingTimeSequence.length - 1].departure_time = null;

  return passingTimeSequence;
};

export const buildRandomPassingTimeSequence = flow(
  buildRandomTimeSequence,
  buildPassingTimeSequence,
);
