import { Duration } from 'luxon';
import { TimetabledPassingTimeInsertInput } from '../../types';
import { buildRandomDuration } from '../common';

export type RegularTimeSequenceParams = {
  intervalMs: number;
};
export const buildRegularTimeSequence = (
  startTime: Duration,
  count: number,
  { intervalMs }: RegularTimeSequenceParams,
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

export type RandomTimeSequenceParams = {
  minTimeMs: number;
  maxTimeMs: number;
};

export const buildRandomTimeSequence = (
  startTime: Duration,
  count: number,
  { minTimeMs, maxTimeMs }: RandomTimeSequenceParams,
) => {
  let current: Duration = startTime;
  const timeSequence: Duration[] = [current];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < count; i++) {
    const intervalMs = buildRandomDuration(minTimeMs, maxTimeMs);
    current = current.plus(intervalMs);
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

export type TimeSequenceParams =
  | RandomTimeSequenceParams
  | RegularTimeSequenceParams;

export function isRandomTimeSequenceBuilder(
  tsBuilder: TimeSequenceParams,
): tsBuilder is RandomTimeSequenceParams {
  return Object.prototype.hasOwnProperty.call(tsBuilder, 'minTimeMs');
}

export const buildTimeSequence = (
  startTime: Duration,
  count: number,
  tsBuilder: TimeSequenceParams,
) =>
  isRandomTimeSequenceBuilder(tsBuilder)
    ? buildRandomTimeSequence(startTime, count, tsBuilder)
    : buildRegularTimeSequence(startTime, count, tsBuilder);
