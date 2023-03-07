import { Duration } from 'luxon';
import { TimetabledPassingTimeInsertInput } from '../../types';
import { buildRandomDuration } from '../common';

export type RegularTimeSequenceParams = {
  interval: Duration;
};
export const buildRegularTimeSequence = (
  startTime: Duration,
  count: number,
  { interval }: RegularTimeSequenceParams,
) => {
  let current: Duration = startTime;
  const timeSequence: Duration[] = [current];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < count; i++) {
    console.log('current', current);
    console.log('interval', interval);
    current = current.plus(interval);
    timeSequence.push(current);
  }
  return timeSequence;
};

export type RandomTimeSequenceParams = {
  minTime: Duration;
  maxTime: Duration;
};

export const buildRandomTimeSequence = (
  startTime: Duration,
  count: number,
  { minTime, maxTime }: RandomTimeSequenceParams,
) => {
  let current: Duration = startTime;
  const timeSequence: Duration[] = [current];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < count; i++) {
    const increment = buildRandomDuration(minTime, maxTime);
    current = current.plus(increment);
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
  return Object.prototype.hasOwnProperty.call(tsBuilder, 'minTime');
}

export const buildTimeSequence = (
  startTime: Duration,
  count: number,
  tsBuilder: TimeSequenceParams,
) =>
  isRandomTimeSequenceBuilder(tsBuilder)
    ? buildRandomTimeSequence(startTime, count, tsBuilder)
    : buildRegularTimeSequence(startTime, count, tsBuilder);
