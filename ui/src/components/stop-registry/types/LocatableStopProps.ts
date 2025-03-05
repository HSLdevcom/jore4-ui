import { DateTime } from 'luxon';
import { LocatableStop } from './LocatableStop';

export type LocatableStopProps = {
  readonly className?: string;
  readonly stop: LocatableStop;
};

export type LocatableStopWithObservationDateProps = LocatableStopProps & {
  readonly observationDate?: DateTime;
};

export type LocatableStopWithObserveOnValidityStartProps =
  LocatableStopProps & {
    readonly observeOnStopValidityStartDate?: boolean;
  };
