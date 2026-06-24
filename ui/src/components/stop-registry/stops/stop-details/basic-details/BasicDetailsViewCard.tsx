import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAccessTime } from 'react-icons/md';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { StopWithDetails } from '../../../../../types';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { getEffectiveStopState } from '../getEffectiveStopState';
import { StopAreaDetailsSection } from './BasicDetailsStopAreaFields';
import { StopDetailsSection } from './BasicDetailsStopFields';

type BasicDetailsViewCardProps = {
  readonly stop: StopWithDetails;
};

export const BasicDetailsViewCard: FC<BasicDetailsViewCardProps> = ({
  stop,
}) => {
  const { t } = useTranslation();
  const { observationDate } = useObservationDateQueryParam();

  const validityStart = stop.quay?.stopStateValidityStart;
  const effectiveState = getEffectiveStopState(
    stop.quay?.stopState,
    stop.quay?.stopStateValidityStart,
    stop.quay?.stopStateValidityEnd,
    observationDate,
  );
  const hasFutureStateChange =
    effectiveState === StopPlaceState.InOperation &&
    !!validityStart &&
    stop.quay?.stopState !== StopPlaceState.InOperation &&
    DateTime.fromISO(validityStart) > observationDate;

  return (
    <>
      {hasFutureStateChange && (
        <div className="mb-2 flex items-center gap-1 text-sm text-grey">
          <MdAccessTime className="text-base" />
          <span>
            {t(($) => $.stopDetails.basicDetails.stateChangesOn, {
              date: DateTime.fromISO(validityStart).toFormat('dd.MM.yyyy'),
            })}
          </span>
        </div>
      )}
      <StopAreaDetailsSection stop={stop} />
      <StopDetailsSection stop={stop} />
    </>
  );
};
