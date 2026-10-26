import { TimetabledPassingTimeInsertInput } from '../../types';
import { buildRandomDuration } from '../common';

export type RegularTimeSequenceParams = {
  interval: Temporal.Duration;
};
export const buildRegularTimeSequence = (
  startTime: Temporal.Duration,
  count: number,
  { interval }: RegularTimeSequenceParams,
) => {
  let current: Temporal.Duration = startTime;
  const timeSequence: Temporal.Duration[] = [current];

  for (let i = 1; i < count; i++) {
    current = current.add(interval);
    timeSequence.push(current);
  }
  return timeSequence;
};

export type RandomTimeSequenceParams = {
  minTime: Temporal.Duration;
  maxTime: Temporal.Duration;
};

export const buildRandomTimeSequence = (
  startTime: Temporal.Duration,
  count: number,
  { minTime, maxTime }: RandomTimeSequenceParams,
) => {
  let current: Temporal.Duration = startTime;
  const timeSequence: Temporal.Duration[] = [current];

  for (let i = 1; i < count; i++) {
    const increment = buildRandomDuration(minTime, maxTime);
    current = current.add(increment);
    timeSequence.push(current);
  }
  return timeSequence;
};

export type PassingTime = Required<
  Pick<TimetabledPassingTimeInsertInput, 'arrival_time' | 'departure_time'>
>;

export const buildPassingTimeSequence = (
  timeSequence: Temporal.Duration[],
): PassingTime[] => {
  // we cannot generate a valid sequence with less than 2 stops
  if (timeSequence.length < 2) {
    return [];
  }

  const passingTimeSequence: PassingTime[] = timeSequence.map((time) => ({
    arrival_time: time,
    departure_time: time,
  }));

  passingTimeSequence[0].arrival_time = null;
  passingTimeSequence[passingTimeSequence.length - 1].departure_time = null;

  return passingTimeSequence;
};

export type TimeSequenceParams =
  RandomTimeSequenceParams | RegularTimeSequenceParams;

export function isRandomTimeSequenceBuilder(
  tsBuilder: TimeSequenceParams,
): tsBuilder is RandomTimeSequenceParams {
  return Object.prototype.hasOwnProperty.call(tsBuilder, 'minTime');
}

export const buildTimeSequence = (
  startTime: Temporal.Duration,
  count: number,
  tsBuilder: TimeSequenceParams,
) =>
  isRandomTimeSequenceBuilder(tsBuilder)
    ? buildRandomTimeSequence(startTime, count, tsBuilder)
    : buildRegularTimeSequence(startTime, count, tsBuilder);
