import { Duration } from 'luxon';

export const multiplyDuration = (duration: Duration, multiplier: number) => {
  const durationInMs = duration.toMillis();
  const multiplied = durationInMs * multiplier;
  return Duration.fromMillis(multiplied);
};
